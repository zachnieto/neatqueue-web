import { useHookstate } from "@hookstate/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getServerInfo } from "../services/neatqueue-service";
import { getWsSocket } from "../services/ws-service";
import globalState from "../state";
import type { QueueInfo, ServerQueuesData } from "../types";

function mergeQueueUpdate(
	prev: ServerQueuesData | undefined,
	payload: {
		channel_id: string | number;
		players?: unknown[] | null;
		queue_size?: number;
		current_size?: number;
		locked?: boolean;
		test?: boolean;
		roles?: string[];
		name?: string;
		[key: string]: unknown;
	},
): ServerQueuesData | undefined {
	if (!prev) return prev;
	const channelId = String(payload.channel_id);

	// Check if this is a new queue not yet in the list
	const existingIdx = prev.queues.findIndex(
		(q) => String(q.channel.id) === channelId,
	);
	if (existingIdx === -1) {
		// Append new queue from the WS payload
		const newQueue = {
			name: (payload.name as string) ?? "Queue",
			channel: {
				id: Number(channelId) || (channelId as unknown as number),
				name: (payload.channel as { name?: string })?.name ?? channelId,
			},
			players: (payload.players ??
				[]) as ServerQueuesData["queues"][0]["players"],
			...(payload.queue_size != null && { queue_size: payload.queue_size }),
			...(payload.current_size != null && {
				current_size: payload.current_size,
			}),
			...(payload.team_size != null && {
				team_size: payload.team_size as number,
			}),
			...(payload.number_of_teams != null && {
				number_of_teams: payload.number_of_teams as number,
			}),
			...(payload.locked != null && { locked: payload.locked }),
			...(payload.roles != null && { roles: payload.roles }),
			...(payload.test != null && { test: payload.test }),
		};
		return {
			...prev,
			queues: [...prev.queues, newQueue as ServerQueuesData["queues"][0]],
		};
	}

	const queues = prev.queues.map((q) => {
		if (String(q.channel.id) !== channelId) return q;
		const mergedPlayers =
			payload.players !== undefined && payload.players !== null
				? payload.players
				: payload.current_size === 0
					? []
					: q.players;
		return {
			...q,
			players: mergedPlayers as ServerQueuesData["queues"][0]["players"],
			...(payload.name != null && { name: payload.name as string }),
			...(payload.queue_size != null && {
				queue_size: payload.queue_size as number,
			}),
			...(payload.current_size != null && {
				current_size: payload.current_size as number,
			}),
			...(payload.team_size != null && {
				team_size: payload.team_size as number,
			}),
			...(payload.number_of_teams != null && {
				number_of_teams: payload.number_of_teams as number,
			}),
			...(payload.locked != null && { locked: payload.locked as boolean }),
			...(payload.roles != null && { roles: payload.roles as string[] }),
			...(payload.test != null && { test: payload.test as boolean }),
		};
	});
	return { ...prev, queues };
}

export function useServerQueues(serverId: string | undefined) {
	const queryClient = useQueryClient();
	const state = useHookstate(globalState);
	const accessToken = state.auth.get()?.access_token;

	const query = useQuery({
		queryKey: ["server", serverId],
		queryFn: () => getServerInfo(serverId ?? ""),
		enabled: !!serverId,
	});

	useEffect(() => {
		if (!serverId || !accessToken) return;
		const socket = getWsSocket();
		socket.ensureConnected(serverId);
		const unsub = socket.on("queue_update", (data: Record<string, unknown>) => {
			queryClient.setQueryData<ServerQueuesData>(["server", serverId], (prev) =>
				mergeQueueUpdate(prev, data as Parameters<typeof mergeQueueUpdate>[1]),
			);
		});
		const unsubDelete = socket.on(
			"queue_deleted",
			(data: Record<string, unknown>) => {
				const deletedChannelId = String(data.channel_id);
				queryClient.setQueryData<ServerQueuesData>(
					["server", serverId],
					(prev) => {
						if (!prev) return prev;
						return {
							...prev,
							queues: prev.queues.filter(
								(q) => String(q.channel.id) !== deletedChannelId,
							),
						};
					},
				);
			},
		);
		return () => {
			unsub();
			unsubDelete();
			socket.disconnect();
		};
	}, [serverId, queryClient, accessToken]);

	return query;
}

export function useServerQueuesData(serverId: string | undefined): {
	queues: QueueInfo[];
	info: ServerQueuesData["info"] | undefined;
} {
	const { data } = useServerQueues(serverId);
	const queues: QueueInfo[] =
		data?.queues?.map((q) => {
			const qAny = q as typeof q & {
				queue_size?: number;
				team_size?: number;
				number_of_teams?: number;
			};
			const queueSize =
				qAny.queue_size ??
				(qAny.team_size && qAny.number_of_teams
					? qAny.team_size * qAny.number_of_teams
					: 10);
			return {
				channel_id: String(q.channel.id),
				queue_size: queueSize,
				locked: false,
				roles: [],
				team_size: qAny.team_size ?? 0,
				number_of_teams: qAny.number_of_teams ?? 0,
				...q,
				name: q.name,
				players: q.players ?? [],
			};
		}) ?? [];
	return {
		queues,
		info: data?.info,
	};
}
