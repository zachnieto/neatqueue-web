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

type ActionResult = {
	action: string;
	success: boolean;
	message?: string;
	variant?: "success" | "error" | "info";
	channel_id?: string;
	server_id?: string;
	game_num?: number;
};

export function useJoinQueue() {
	const queryClient = useQueryClient();
	const toast = useToast();
	const resolveRef = useRef<((value: boolean) => void) | null>(null);
	const pendingParamsRef = useRef<{
		serverId: string;
		channelId: string;
	} | null>(null);

	useEffect(() => {
		const socket = getWsSocket();
		const unsub = socket.on(
			"action_result",
			(data: Record<string, unknown>) => {
				const result = data as ActionResult;
				if (result.action !== "join_queue") return;
				const pending = pendingParamsRef.current;
				if (
					pending &&
					String(result.server_id) === pending.serverId &&
					String(result.channel_id) === pending.channelId
				) {
					pendingParamsRef.current = null;
					if (resolveRef.current) {
						resolveRef.current(result.success === true);
						resolveRef.current = null;
					}
					if (result.message) {
						toast.showToast(result.message, {
							variant: result.variant ?? "success",
						});
					}
				}
			},
		);
		return () => unsub();
	}, [toast]);

	const mutation = useMutation({
		mutationFn: async (params: JoinQueueParams) => {
			getWsSocket().ensureConnected();
			return new Promise<boolean>((resolve, reject) => {
				resolveRef.current = resolve;
				pendingParamsRef.current = {
					serverId: params.serverId,
					channelId: params.channelId,
				};
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
						pendingParamsRef.current = null;
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
	const pendingParamsRef = useRef<{
		serverId: string;
		channelId: string;
	} | null>(null);

	useEffect(() => {
		const socket = getWsSocket();
		const unsub = socket.on(
			"action_result",
			(data: Record<string, unknown>) => {
				const result = data as ActionResult;
				if (result.action !== "leave_queue") return;
				const pending = pendingParamsRef.current;
				if (
					pending &&
					String(result.server_id) === pending.serverId &&
					String(result.channel_id) === pending.channelId
				) {
					pendingParamsRef.current = null;
					if (resolveRef.current) {
						resolveRef.current(result.success === true);
						resolveRef.current = null;
					}
					if (result.message) {
						toast.showToast(result.message, {
							variant: result.variant ?? "success",
						});
					}
				}
			},
		);
		return () => unsub();
	}, [toast]);

	const mutation = useMutation({
		mutationFn: async (params: LeaveQueueParams) => {
			getWsSocket().ensureConnected();
			return new Promise<boolean>((resolve, reject) => {
				resolveRef.current = resolve;
				pendingParamsRef.current = {
					serverId: params.serverId,
					channelId: params.channelId,
				};
				getWsSocket().leaveQueue(params.serverId, params.channelId);
				setTimeout(() => {
					if (resolveRef.current) {
						resolveRef.current = null;
						pendingParamsRef.current = null;
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
					const result = data as ActionResult;
					if (
						result.action === "web_ready_up" &&
						String(result.server_id) === serverId &&
						result.game_num === gameNum
					) {
						cleanup();
						if (result.success) {
							resolve();
						} else {
							reject(new Error(String(result.message || "Failed to ready up")));
						}
					}
				};

				const cleanup1 = socket.on("action_result", handleResult);

				const cleanup = () => {
					clearTimeout(timeoutId);
					cleanup1();
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
					const result = data as ActionResult;
					if (
						result.action === "web_decline_match" &&
						String(result.server_id) === serverId &&
						result.game_num === gameNum
					) {
						cleanup();
						if (result.success) {
							resolve();
						} else {
							reject(
								new Error(String(result.message || "Failed to decline match")),
							);
						}
					}
				};

				const cleanup1 = socket.on("action_result", handleResult);

				const cleanup = () => {
					clearTimeout(timeoutId);
					cleanup1();
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
