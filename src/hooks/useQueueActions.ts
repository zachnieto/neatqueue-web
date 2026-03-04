import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getWsSocket } from "../services/ws-service";
import { useToast } from "./useToast";

type JoinQueueParams = {
	serverId: string;
	channelId: string;
	role?: string;
	surveyAnswers?: Record<string, unknown>;
};

type LeaveQueueParams = {
	serverId: string;
	channelId: string;
};

export function useJoinQueue() {
	const queryClient = useQueryClient();
	const toast = useToast();
	const resolveRef = useRef<((value: boolean) => void) | null>(null);

	useEffect(() => {
		const socket = getWsSocket();
		const unsubResult = socket.on(
			"join_queue_result",
			(data: Record<string, unknown>) => {
				const success = data.success === true;
				if (resolveRef.current) {
					resolveRef.current(success);
					resolveRef.current = null;
				}
				if (success) toast.showToast("Joined queue!", { variant: "success" });
				else if (data.message)
					toast.showToast(String(data.message), { variant: "error" });
			},
		);
		const unsubError = socket.on("error", (data: Record<string, unknown>) => {
			if (data.ref !== "join_queue") return;
			if (resolveRef.current) {
				resolveRef.current(false);
				resolveRef.current = null;
			}
			toast.showToast(
				data.message ? String(data.message) : "Failed to join queue",
				{ variant: "error" },
			);
		});
		return () => {
			unsubResult();
			unsubError();
		};
	}, [toast]);

	const mutation = useMutation({
		mutationFn: async (params: JoinQueueParams) => {
			getWsSocket().ensureConnected();
			return new Promise<boolean>((resolve, reject) => {
				resolveRef.current = resolve;
				getWsSocket().joinQueue(
					params.serverId,
					params.channelId,
					params.role,
					params.surveyAnswers,
				);
				// Timeout in case no response
				setTimeout(() => {
					if (resolveRef.current) {
						resolveRef.current = null;
						reject(new Error("Join queue timed out"));
					}
				}, 15000);
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["server", variables.serverId],
			});
		},
		onError: (error) => {
			if (error instanceof Error && error.message.includes("timed out")) {
				toast.showToast("Join queue timed out — please try again", {
					variant: "error",
				});
			}
		},
	});

	return mutation;
}

export function useLeaveQueue() {
	const queryClient = useQueryClient();
	const toast = useToast();
	const resolveRef = useRef<((value: boolean) => void) | null>(null);

	useEffect(() => {
		const socket = getWsSocket();
		const unsubResult = socket.on(
			"leave_queue_result",
			(data: Record<string, unknown>) => {
				const success = data.success === true;
				if (resolveRef.current) {
					resolveRef.current(success);
					resolveRef.current = null;
				}
				if (success) toast.showToast("Left queue", { variant: "success" });
				else if (data.message)
					toast.showToast(String(data.message), { variant: "error" });
			},
		);
		const unsubError = socket.on("error", (data: Record<string, unknown>) => {
			if (data.ref !== "leave_queue") return;
			if (resolveRef.current) {
				resolveRef.current(false);
				resolveRef.current = null;
			}
			toast.showToast(
				data.message ? String(data.message) : "Failed to leave queue",
				{ variant: "error" },
			);
		});
		return () => {
			unsubResult();
			unsubError();
		};
	}, [toast]);

	const mutation = useMutation({
		mutationFn: async (params: LeaveQueueParams) => {
			getWsSocket().ensureConnected();
			return new Promise<boolean>((resolve, reject) => {
				resolveRef.current = resolve;
				getWsSocket().leaveQueue(params.serverId, params.channelId);
				setTimeout(() => {
					if (resolveRef.current) {
						resolveRef.current = null;
						reject(new Error("Leave queue timed out"));
					}
				}, 15000);
			});
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["server", variables.serverId],
			});
		},
		onError: (error) => {
			if (error instanceof Error && error.message.includes("timed out")) {
				toast.showToast("Leave queue timed out — please try again", {
					variant: "error",
				});
			}
		},
	});

	return mutation;
}

export function useReadyUp() {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: async ({
			serverId,
			gameNum,
		}: {
			serverId: string;
			gameNum: number;
		}) => {
			return new Promise<void>((resolve, reject) => {
				const socket = getWsSocket();
				if (!socket.connected) {
					return reject(new Error("Not connected to server"));
				}

				const timeoutId = setTimeout(() => {
					cleanup();
					reject(new Error("Ready up request timed out"));
				}, 5000);

				const handleResult = (data: Record<string, unknown>) => {
					if (data.server_id === serverId && data.game_num === gameNum) {
						if (data.success) {
							cleanup();
							resolve();
						} else {
							cleanup();
							reject(new Error(String(data.error || "Failed to ready up")));
						}
					}
				};

				const handleError = (data: Record<string, unknown>) => {
					if (data.ref === "web_ready_up") {
						cleanup();
						reject(new Error(String(data.message || "Ready up error")));
					}
				};

				const cleanup1 = socket.on("ready_up_result", handleResult);
				const cleanup2 = socket.on("error", handleError);

				const cleanup = () => {
					clearTimeout(timeoutId);
					cleanup1();
					cleanup2();
				};

				socket.readyUpMatch(serverId, gameNum);
			});
		},
		onSuccess: (_, { serverId }) => {
			queryClient.invalidateQueries({ queryKey: ["active-matches", serverId] });
		},
		onError: (error) => {
			toast.showToast(error.message, { variant: "error" });
		},
	});
}

export function useDeclineMatch() {
	const queryClient = useQueryClient();
	const toast = useToast();

	return useMutation({
		mutationFn: async ({
			serverId,
			gameNum,
		}: {
			serverId: string;
			gameNum: number;
		}) => {
			return new Promise<void>((resolve, reject) => {
				const socket = getWsSocket();
				if (!socket.connected) {
					return reject(new Error("Not connected to server"));
				}

				const timeoutId = setTimeout(() => {
					cleanup();
					reject(new Error("Decline match request timed out"));
				}, 5000);

				const handleResult = (data: Record<string, unknown>) => {
					if (data.server_id === serverId && data.game_num === gameNum) {
						if (data.success) {
							cleanup();
							resolve();
						} else {
							cleanup();
							reject(
								new Error(String(data.error || "Failed to decline match")),
							);
						}
					}
				};

				const handleError = (data: Record<string, unknown>) => {
					if (data.ref === "web_decline_match") {
						cleanup();
						reject(new Error(String(data.message || "Decline match error")));
					}
				};

				const cleanup1 = socket.on("decline_match_result", handleResult);
				const cleanup2 = socket.on("error", handleError);

				const cleanup = () => {
					clearTimeout(timeoutId);
					cleanup1();
					cleanup2();
				};

				socket.declineMatch(serverId, gameNum);
			});
		},
		onSuccess: (_, { serverId }) => {
			queryClient.invalidateQueries({ queryKey: ["active-matches", serverId] });
			queryClient.invalidateQueries({ queryKey: ["server-queues", serverId] });
		},
		onError: (error) => {
			toast.showToast(error.message, { variant: "error" });
		},
	});
}
