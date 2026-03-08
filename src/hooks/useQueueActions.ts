import { useMutation } from "@tanstack/react-query";
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

/** When backend sends success with no message, show action-specific copy; otherwise use message. */
function actionResultMessage(
	action: string,
	message: string | undefined,
): string {
	if (!message) {
		const defaults: Record<string, string> = {
			join_queue: "Joined queue!",
			leave_queue: "Left queue!",
			ready_up: "Match ready!",
			decline_match: "Match declined!",
		};
		return defaults[action] ?? "";
	}
	return message;
}

export function useJoinQueue() {
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
					const displayMessage = actionResultMessage(
						result.action,
						result.message,
					);
					if (displayMessage) {
						toast.showToast(displayMessage, {
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
			getWsSocket().ensureConnected(params.serverId);
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
					const displayMessage = actionResultMessage(
						result.action,
						result.message,
					);
					if (displayMessage) {
						toast.showToast(displayMessage, {
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
			getWsSocket().ensureConnected(params.serverId);
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
	const toast = useToast();

	return useMutation({
		mutationFn: async ({
			serverId,
			gameNum,
			channelId,
		}: {
			serverId: string;
			gameNum: number;
			channelId: string | number;
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
						result.action === "ready_up" &&
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

				socket.readyUpMatch(serverId, gameNum, channelId);
			});
		},
		onError: (error) => {
			toast.showToast(error.message, { variant: "error" });
		},
	});
}

export function useDeclineMatch() {
	const toast = useToast();

	return useMutation({
		mutationFn: async ({
			serverId,
			gameNum,
			channelId,
		}: {
			serverId: string;
			gameNum: number;
			channelId: string | number;
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
						result.action === "decline_match" &&
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

				socket.declineMatch(serverId, gameNum, channelId);
			});
		},
		onError: (error) => {
			toast.showToast(error.message, { variant: "error" });
		},
	});
}
