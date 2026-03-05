import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import NumberFlow from "@number-flow/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ActiveMatchCard from "../components/queue/ActiveMatchCard";
import MatchFoundOverlay from "../components/queue/MatchFoundOverlay";
import QueueCard from "../components/queue/QueueCard";
import WsStatusIndicator from "../components/queue/WsStatusIndicator";
import Input from "../components/ui/Input";
import ServerPageLayout from "../components/ui/ServerPageLayout";
import { useServerQueues } from "../hooks/useServerQueues";
import {
	getServerMatches,
	type ServerMatchPayload,
} from "../services/neatqueue-service";
import { getWsSocket } from "../services/ws-service";
import globalState from "../state";
import type { ActiveMatch, QueueInfo } from "../types";

export default function ServerQueuesPage() {
	const { serverId } = useParams();
	const queryClient = useQueryClient();
	const userId = globalState.get().user?.id;
	const [searchQuery, setSearchQuery] = useState("");

	const { data, isLoading, error } = useServerQueues(serverId);
	const { data: matchesData } = useQuery({
		queryKey: ["matches", serverId],
		queryFn: () => getServerMatches(serverId ?? ""),
		enabled: !!serverId,
	});

	const matches = matchesData
		? Object.entries(matchesData).map(([gameNum, m]) => {
				const raw = m as Record<string, unknown>;
				const channel = raw.channel as
					| {
							id: string | number;
							name?: string | null;
							type?: "text" | "voice";
					  }
					| undefined;
				const queue_channel = raw.queue_channel as
					| {
							id: string | number;
							name?: string | null;
							type?: "text" | "voice";
					  }
					| undefined;
				const voiceChannelsRaw = raw.voice_channels as
					| {
							id: string | number;
							name?: string | null;
							type?: "text" | "voice";
					  }[]
					| undefined;
				const mapRef = (r: {
					id: string | number;
					name?: string | null;
					type?: "text" | "voice";
				}) => ({
					id: r.id,
					name: r.name ?? null,
					type: r.type === "voice" ? ("voice" as const) : ("text" as const),
				});
				return {
					game_num: Number(gameNum),
					teams: (m.teams as unknown[][]) ?? [],
					players: m.players,
					channel:
						channel != null && channel.id != null ? mapRef(channel) : undefined,
					queue_channel:
						queue_channel != null && queue_channel.id != null
							? mapRef(queue_channel)
							: undefined,
					voice_channels: Array.isArray(voiceChannelsRaw)
						? voiceChannelsRaw
								.filter((vc) => vc != null && vc.id != null)
								.map((vc) => mapRef(vc))
						: [],
					stage: String(raw.stage || ""),
					ready_players: Array.isArray(raw.ready_players)
						? raw.ready_players.map(String)
						: [],
					ready_up_mode:
						typeof raw.ready_up_mode === "number"
							? raw.ready_up_mode
							: undefined,
					timer_end:
						typeof raw.timer_end === "number" ? raw.timer_end : undefined,
				};
			})
		: [];

	const myMatches = userId
		? matches.filter((m) => {
				const players = (m.players as { id: string }[]) ?? [];
				return players.some((p) => String(p.id) === userId);
			})
		: [];

	const matchNeedingReadyUp = myMatches.find(
		(m) => m.stage === "VALIDATING_PLAYERS" && m.ready_up_mode !== 2,
	);

	const myMatchGameNums = new Set(myMatches.map((m) => m.game_num));
	const _otherMatches = matches.filter((m) => !myMatchGameNums.has(m.game_num));

	useEffect(() => {
		if (!serverId) return;
		const socket = getWsSocket();
		const unsub = socket.on("match_update", (data: Record<string, unknown>) => {
			const payloadGuildId = data.guild_id != null ? String(data.guild_id) : "";
			if (payloadGuildId !== serverId) return;
			const gameNum = data.game_num != null ? String(data.game_num) : null;
			if (!gameNum) return;
			queryClient.setQueryData<Record<string, ServerMatchPayload>>(
				["matches", serverId],
				(old) => ({
					...old,
					[gameNum]: data as unknown as ServerMatchPayload,
				}),
			);
		});
		const unsubMatchDelete = socket.on(
			"match_deleted",
			(data: Record<string, unknown>) => {
				const payloadGuildId =
					data.guild_id != null ? String(data.guild_id) : "";
				if (payloadGuildId !== serverId) return;
				const gameNum = data.game_num != null ? String(data.game_num) : null;
				if (!gameNum) return;
				queryClient.setQueryData<Record<string, ServerMatchPayload>>(
					["matches", serverId],
					(old) => {
						if (!old) return old;
						const { [gameNum]: _, ...rest } = old;
						return rest;
					},
				);
			},
		);
		return () => {
			unsub();
			unsubMatchDelete();
		};
	}, [serverId, queryClient]);

	const queues: QueueInfo[] = useMemo(() => {
		if (!data) return [];
		return data.queues.map((q) => {
			const qAny = q as unknown as {
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
				...q,
				channel_id: String(q.channel.id),
				queue_size: queueSize,
				locked: (q as { locked?: boolean }).locked ?? false,
				roles: (q as { roles?: string[] }).roles ?? [],
				team_size: qAny.team_size ?? 0,
				number_of_teams: qAny.number_of_teams ?? 0,
				players: q.players ?? [],
			};
		});
	}, [data]);

	const statsItems = useMemo(() => {
		const stats = data?.stats;
		const totalPlayersInQueues = queues.reduce(
			(sum, q) => sum + (q.current_size ?? q.players?.length ?? 0),
			0,
		);
		return [
			{
				label: "Players In Queue",
				value:
					stats?.players_in_queues != null
						? stats.players_in_queues.toLocaleString()
						: String(totalPlayersInQueues),
				color: "#00b4ff",
			},
			{
				label: "Active Queues",
				value:
					stats?.active_queues != null
						? String(stats.active_queues)
						: String(queues.length),
				color: "#39d98a",
			},
			{
				label: "Active Matches",
				value: matches.length,
				color: "#ffae00ff",
			},
			{
				label: "Matches Today",
				value:
					stats?.daily_games != null
						? stats.daily_games.toLocaleString()
						: String(matches.length),
				color: "#a55eea",
			},
		];
	}, [data?.stats, queues, matches.length]);

	const filteredQueues = useMemo(() => {
		if (!searchQuery.trim()) return queues;
		const q = searchQuery.toLowerCase();
		return queues.filter(
			(queue) =>
				queue.name.toLowerCase().includes(q) ||
				queue.roles?.some((r) => r.toLowerCase().includes(q)),
		);
	}, [queues, searchQuery]);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-red-400">Failed to load server. Please try again.</p>
			</div>
		);
	}

	if (!serverId) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-gray-400">No server selected.</p>
			</div>
		);
	}

	const isDataLoading = isLoading || !data;
	const info = data?.info;

	return (
		<>
			{matchNeedingReadyUp && (
				<MatchFoundOverlay
					match={matchNeedingReadyUp as ActiveMatch}
					serverId={serverId}
					currentUserId={userId ?? ""}
				/>
			)}
			<ServerPageLayout
				serverName={info?.name}
				serverIconUrl={info?.icon_url}
				memberCount={info?.member_count}
				serverHeaderLoading={isDataLoading}
				topBarTrailing={<WsStatusIndicator />}
			>
				{/* Stats strip */}
				<div
					className="grid grid-cols-4 gap-3 mb-10 rounded-sm overflow-hidden"
					style={{
						background: "rgba(255,255,255,0.02)",
						border: "1px solid rgba(255,255,255,0.06)",
					}}
				>
					{statsItems.map(({ label, value, color }) => (
						<div
							key={label}
							className="flex flex-col items-center justify-center py-4 px-3 relative"
							style={{
								borderRight: "1px solid rgba(255,255,255,0.04)",
							}}
						>
							{isDataLoading ? (
								<div className="h-[24px] bg-white/10 rounded w-12 mb-1 animate-pulse" />
							) : (
								<div
									style={{
										fontFamily: "'JetBrains Mono', monospace",
										fontSize: "22px",
										fontWeight: 700,
										color,
										letterSpacing: "-0.02em",
										lineHeight: 1.1,
									}}
								>
									{<NumberFlow value={value} />}
								</div>
							)}
							<div
								style={{
									fontSize: "10px",
									color: "#5a6078",
									marginTop: 4,
									letterSpacing: "0.08em",
									textTransform: "uppercase",
								}}
							>
								{label}
							</div>
							<div
								style={{
									position: "absolute",
									bottom: 0,
									left: "50%",
									transform: "translateX(-50%)",
									width: 24,
									height: 2,
									background: color,
									opacity: 0.6,
									borderRadius: 1,
								}}
							/>
						</div>
					))}
				</div>

				{/* Section header: QUEUES + search */}
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
					<div>
						<div className="flex items-center gap-3 mb-1">
							<h2
								className="accent-underline"
								style={{
									fontFamily: "'Rajdhani', sans-serif",
									fontSize: "32px",
									fontWeight: 700,
									color: "#e8eaf0",
									letterSpacing: "0.06em",
									lineHeight: 1,
								}}
							>
								QUEUES
							</h2>
							{isDataLoading ? (
								<div className="h-5 bg-white/10 rounded w-20 animate-pulse" />
							) : (
								<span
									style={{
										padding: "3px 8px",
										borderRadius: 2,
										background: "rgba(0,180,255,0.1)",
										border: "1px solid rgba(0,180,255,0.25)",
										fontFamily: "'JetBrains Mono', monospace",
										fontSize: "11px",
										fontWeight: 700,
										color: "#00b4ff",
										letterSpacing: "0.08em",
									}}
								>
									{filteredQueues.length} AVAILABLE
								</span>
							)}
						</div>
						<p
							style={{
								fontFamily: "'Inter', sans-serif",
								fontSize: "13px",
								color: "#5a6078",
								marginTop: 14,
								letterSpacing: "0.02em",
							}}
						>
							Select a queue to find your next match.
						</p>
					</div>
					<div className="relative" style={{ minWidth: 200 }}>
						<MagnifyingGlassIcon
							className="w-[13px] h-[13px] absolute left-[11px] top-1/2 -translate-y-1/2"
							style={{ color: "#5a6078" }}
						/>
						<Input
							type="text"
							placeholder="Search queues..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							style={{ paddingLeft: 32 }}
						/>
					</div>
				</div>

				{/* Queue grid */}
				<section className="mb-8">
					{isDataLoading ? (
						<div
							className="grid gap-4"
							style={{
								gridTemplateColumns:
									"repeat(auto-fill, minmax(min(100%, 335px), 1fr))",
							}}
						>
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className="h-[340px] bg-white/5 border border-white/10 rounded-sm animate-pulse"
								/>
							))}
						</div>
					) : filteredQueues.length > 0 ? (
						<div
							className="grid gap-4"
							style={{
								gridTemplateColumns:
									"repeat(auto-fill, minmax(min(100%, 335px), 1fr))",
							}}
						>
							{filteredQueues.map((queue) => (
								<QueueCard
									key={queue.channel_id}
									queue={queue}
									serverId={serverId}
								/>
							))}
						</div>
					) : (
						<div
							className="flex flex-col items-center justify-center py-24 rounded-sm"
							style={{
								background: "rgba(255,255,255,0.02)",
								border: "1px solid rgba(255,255,255,0.06)",
							}}
						>
							<div
								style={{
									width: 56,
									height: 56,
									borderRadius: 4,
									background: "rgba(255,255,255,0.04)",
									border: "1px solid rgba(255,255,255,0.08)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									marginBottom: 16,
								}}
							>
								<MagnifyingGlassIcon
									className="w-[22px] h-[22px]"
									style={{ color: "#3d4258" }}
								/>
							</div>
							<div
								style={{
									fontFamily: "'Rajdhani', sans-serif",
									fontSize: "18px",
									fontWeight: 700,
									color: "#3d4258",
									letterSpacing: "0.06em",
									marginBottom: 8,
								}}
							>
								NO QUEUES FOUND
							</div>
							<div
								style={{
									fontFamily: "'Inter', sans-serif",
									fontSize: "13px",
									color: "#3d4258",
								}}
							>
								Try adjusting your search.
							</div>
						</div>
					)}
				</section>

				{myMatches.length > 0 && (
					<section className="mb-8">
						<h2
							style={{
								fontFamily: "'Rajdhani', sans-serif",
								fontSize: "22px",
								fontWeight: 700,
								color: "#e8eaf0",
								letterSpacing: "0.04em",
								marginBottom: 16,
							}}
						>
							MY MATCHES
						</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{myMatches.map((match) => {
								const m = match as ActiveMatch;
								const name =
									queues.find(
										(q) => String(q.channel_id) === String(m.queue_channel?.id),
									)?.name ?? m.queue_channel?.name;
								return (
									<ActiveMatchCard
										key={match.game_num}
										match={m}
										serverId={serverId}
										gameNumKey="game_num"
										queueName={name ?? undefined}
									/>
								);
							})}
						</div>
					</section>
				)}
			</ServerPageLayout>
		</>
	);
}
