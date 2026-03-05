import {
	ArrowLeftOnRectangleIcon,
	ArrowRightOnRectangleIcon,
	ClockIcon,
	UserGroupIcon,
} from "@heroicons/react/24/outline";
import NumberFlow from "@number-flow/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useElapsedTime } from "../../hooks/useElapsedTime";
import { useJoinQueue, useLeaveQueue } from "../../hooks/useQueueActions";
import globalState from "../../state";
import type { QueueInfo } from "../../types";
import PlayerList from "./PlayerList";

type QueueStatus = "Live" | "Active" | "Test Mode" | "Locked";

const STATUS_CONFIG: Record<
	QueueStatus,
	{ label: string; bg: string; text: string; dot: string; badgeClass?: string }
> = {
	Live: {
		label: "LIVE",
		bg: "rgba(255,71,87,0.12)",
		text: "#ff4757",
		dot: "#ff4757",
		badgeClass: "badge-live",
	},
	Active: {
		label: "ACTIVE",
		bg: "rgba(57,217,138,0.12)",
		text: "#39d98a",
		dot: "#39d98a",
		badgeClass: "badge-active",
	},
	"Test Mode": {
		label: "TEST MODE",
		bg: "rgba(255,165,2,0.12)",
		text: "#ffa502",
		dot: "#ffa502",
	},
	Locked: {
		label: "LOCKED",
		bg: "rgba(255,165,2,0.12)",
		text: "#ffa502",
		dot: "#ffa502",
	},
};

type QueueCardProps = {
	queue: QueueInfo;
	serverId: string;
};

function deriveStatus(queue: QueueInfo): QueueStatus {
	if (queue.locked) return "Locked";
	if (queue.test) return "Test Mode";
	const size = queue.current_size ?? queue.players?.length ?? 0;
	const max = queue.queue_size ?? 10;
	if (size >= max) return "Live";
	return "Active";
}

export default function QueueCard({ queue, serverId }: QueueCardProps) {
	const [hovered, setHovered] = useState(false);
	const userId = globalState.get().user?.id;
	const joinQueue = useJoinQueue();
	const leaveQueue = useLeaveQueue();

	const channelId = String(
		(queue as { channel_id?: string }).channel_id ??
			(queue as { channel?: { id: number } }).channel?.id ??
			"",
	);
	const players = queue.players ?? [];
	const queueSize =
		queue.queue_size ??
		(queue.team_size && queue.number_of_teams
			? queue.team_size * queue.number_of_teams
			: 10);
	const currentSize = queue.current_size ?? players.length;
	const locked = queue.locked ?? false;
	const testMode = queue.test ?? false;
	const myPlayer = userId
		? players.find((p) => String(p.id) === userId)
		: undefined;
	const isInQueue = !!myPlayer;
	const timeInQueue = useElapsedTime(myPlayer?.timestamp);

	const status = deriveStatus(queue);
	const statusCfg = STATUS_CONFIG[status];
	const isFull = currentSize >= queueSize;
	const fillPct = queueSize > 0 ? (currentSize / queueSize) * 100 : 0;

	const gameModeLabel = queue.team_size
		? Array(queue.number_of_teams || 2)
				.fill(queue.team_size)
				.join("v")
		: `${queueSize}P`;

	const handleJoin = () => {
		joinQueue.mutate({ serverId, channelId });
	};

	const canJoin = !locked && (testMode || !isInQueue);

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Card uses hover for visual accent only; interactive elements are buttons inside.
		<div
			className={`queue-card card-glass rounded-sm ${isInQueue ? "queue-card-searching" : ""}`}
			style={{
				border: `1px solid ${isInQueue ? "rgba(0,180,255,0.5)" : "rgba(255,255,255,0.07)"}`,
				padding: 0,
				position: "relative",
				display: "flex",
				flexDirection: "column",
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			{/* Top accent bar */}
			<div
				style={{
					height: "2px",
					background: isInQueue
						? "linear-gradient(90deg, #00b4ff, #0066cc, transparent)"
						: hovered
							? "linear-gradient(90deg, rgba(0,180,255,0.5), transparent)"
							: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)",
					transition: "background 0.3s ease",
				}}
			/>

			<div
				style={{
					padding: "20px 22px 22px",
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 16,
				}}
			>
				{/* Header row */}
				<div className="flex items-start justify-between gap-3">
					<div style={{ flex: 1, minWidth: 0 }}>
						<div
							style={{
								fontFamily: "'Rajdhani', sans-serif",
								fontSize: "18px",
								fontWeight: 700,
								color: isInQueue ? "#00b4ff" : "#e8eaf0",
								letterSpacing: "0.04em",
								lineHeight: 1.2,
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							{queue.name}
						</div>
						{queue.roles?.length > 0 && (
							<div
								style={{
									fontFamily: "'Inter', sans-serif",
									fontSize: "11px",
									color: "#5a6078",
									marginTop: 3,
									letterSpacing: "0.02em",
								}}
							>
								Roles: {queue.roles.join(", ")}
							</div>
						)}
					</div>
					<div
						className={statusCfg.badgeClass ?? ""}
						style={{
							padding: "3px 10px",
							borderRadius: 2,
							background: "rgba(0,180,255,0.1)",
							border: "1px solid rgba(0,180,255,0.25)",
							fontFamily: "'JetBrains Mono', monospace",
							fontSize: "10px",
							fontWeight: 700,
							color: "#00b4ff",
							letterSpacing: "0.08em",
						}}
					>
						{gameModeLabel}
					</div>
					<div
						className={statusCfg.badgeClass ?? ""}
						style={{
							display: "flex",
							alignItems: "center",
							gap: 5,
							padding: "4px 10px",
							borderRadius: 2,
							background: statusCfg.bg,
							border: `1px solid ${statusCfg.dot}33`,
							flexShrink: 0,
						}}
					>
						<span
							style={{
								width: 6,
								height: 6,
								borderRadius: "50%",
								background: statusCfg.dot,
								display: "inline-block",
							}}
						/>
						<span
							style={{
								fontFamily: "'JetBrains Mono', monospace",
								fontSize: "9px",
								fontWeight: 700,
								color: statusCfg.text,
								letterSpacing: "0.1em",
							}}
						>
							{statusCfg.label}
						</span>
					</div>
				</div>

				{/* Divider */}
				<div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />

				{/* Players section */}
				<div>
					<div className="flex items-center justify-between mb-3">
						<div
							className="flex items-center gap-1.5"
							style={{
								fontFamily: "'Inter', sans-serif",
								fontSize: "11px",
								color: "#5a6078",
								letterSpacing: "0.05em",
								textTransform: "uppercase",
							}}
						>
							<UserGroupIcon
								className="w-[16px] h-[16px] mb-0.5"
								style={{ color: "#5a6078" }}
							/>
							Players
						</div>
						<div
							style={{
								fontFamily: "'JetBrains Mono', monospace",
								fontSize: "12px",
								fontWeight: 700,
							}}
						>
							<span style={{ color: isFull ? "#39d98a" : "#00b4ff" }}>
								{<NumberFlow value={currentSize} />}
							</span>
							<span style={{ color: "#3d4258" }}> / {queueSize}</span>
						</div>
					</div>

					<PlayerList
						players={players}
						maxPlayers={queueSize}
						hideNames={queue.hide_names}
					/>

					{/* Fill progress bar */}
					<div
						className="mt-3 rounded-full overflow-hidden"
						style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}
					>
						<div
							style={{
								height: "100%",
								width: `${fillPct}%`,
								background: isFull
									? "linear-gradient(90deg, #39d98a, #00cc66)"
									: isInQueue
										? "linear-gradient(90deg, #00b4ff, #0066cc)"
										: "linear-gradient(90deg, #00b4ff88, #00b4ff44)",
								borderRadius: "9999px",
								transition: "width 0.6s ease",
							}}
						/>
					</div>
				</div>

				{/* Stats row */}
				<div className="flex items-center justify-between gap-4">
					{isInQueue && (
						<div className="flex items-center gap-1.5">
							<ClockIcon className="w-3 h-3" style={{ color: "#5a6078" }} />
							<span
								style={{
									fontFamily: "'JetBrains Mono', monospace",
									fontSize: "11px",
									color: "#7a8099",
								}}
							>
								Time in queue:{" "}
								<span style={{ color: "#9aa0b4", fontWeight: 600 }}>
									{timeInQueue}
								</span>
							</span>
						</div>
					)}
					<div className="flex gap-2 items-end" style={{ marginLeft: "auto" }}>
						<Link
							to={`/leaderboard/${serverId}/${channelId}`}
							className="btn-action"
							style={{
								padding: "4px 12px",
								fontSize: 11,
								whiteSpace: "nowrap",
								marginLeft: "auto",
							}}
						>
							LEADERBOARD
						</Link>
						<Link
							to={`/history/${serverId}?queue=${encodeURIComponent(queue.name)}`}
							className="btn-action"
							style={{
								padding: "4px 12px",
								fontSize: 11,
								whiteSpace: "nowrap",
								marginLeft: "auto",
							}}
						>
							HISTORY
						</Link>
					</div>
				</div>

				{/* Action buttons */}
				<div style={{ marginTop: "auto" }}>
					{isInQueue && !testMode ? (
						<div className="flex flex-col gap-2">
							<div
								className="flex items-center justify-center gap-2 py-1.5 rounded"
								style={{ background: "rgba(0,180,255,0.06)" }}
							>
								<span
									className="text-searching"
									style={{
										fontFamily: "'JetBrains Mono', monospace",
										fontSize: "11px",
										fontWeight: 700,
										color: "#00b4ff",
										letterSpacing: "0.1em",
									}}
								>
									◈ SEARCHING FOR MATCH...
								</span>
							</div>
							<button
								type="button"
								className="w-full flex items-center justify-center gap-2 py-2.5 rounded transition-all duration-200"
								style={{
									background: "transparent",
									border: "1px solid rgba(255,71,87,0.35)",
									color: "#ff4757",
									fontFamily: "'Rajdhani', sans-serif",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.1em",
									cursor: "pointer",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = "rgba(255,71,87,0.1)";
									e.currentTarget.style.borderColor = "rgba(255,71,87,0.6)";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = "transparent";
									e.currentTarget.style.borderColor = "rgba(255,71,87,0.35)";
								}}
								onClick={() => leaveQueue.mutate({ serverId, channelId })}
								disabled={leaveQueue.isPending}
							>
								<ArrowLeftOnRectangleIcon className="w-[13px] h-[13px]" />
								{leaveQueue.isPending ? "LEAVING…" : "LEAVE QUEUE"}
							</button>
						</div>
					) : (
						<>
							<button
								type="button"
								className="btn-join w-full flex items-center justify-center gap-2 py-2.5 rounded transition-all duration-200"
								disabled={!canJoin || joinQueue.isPending || isFull}
								style={{
									background:
										!canJoin || isFull
											? "rgba(255,255,255,0.04)"
											: "linear-gradient(135deg, #00b4ff22 0%, #0066cc22 100%)",
									border:
										!canJoin || isFull
											? "1px solid rgba(255,255,255,0.08)"
											: "1px solid rgba(0,180,255,0.4)",
									color: !canJoin || isFull ? "#3d4258" : "#00b4ff",
									fontFamily: "'Rajdhani', sans-serif",
									fontSize: "13px",
									fontWeight: 700,
									letterSpacing: "0.1em",
									cursor: canJoin && !isFull ? "pointer" : "not-allowed",
									opacity: !canJoin || isFull ? 0.5 : 1,
								}}
								onMouseEnter={(e) => {
									if (canJoin && !isFull) {
										e.currentTarget.style.background =
											"linear-gradient(135deg, #00b4ff33 0%, #0066cc33 100%)";
										e.currentTarget.style.color = "#33c6ff";
									}
								}}
								onMouseLeave={(e) => {
									if (canJoin && !isFull) {
										e.currentTarget.style.background =
											"linear-gradient(135deg, #00b4ff22 0%, #0066cc22 100%)";
										e.currentTarget.style.color = "#00b4ff";
									}
								}}
								onClick={() => canJoin && !isFull && handleJoin()}
							>
								<ArrowRightOnRectangleIcon className="w-[13px] h-[13px]" />
								{joinQueue.isPending
									? "JOINING…"
									: isFull
										? "QUEUE FULL"
										: "JOIN QUEUE"}
							</button>
							{testMode && isInQueue && (
								<button
									type="button"
									className="w-full flex items-center justify-center gap-2 py-2.5 rounded transition-all duration-200"
									style={{
										background: "transparent",
										border: "1px solid rgba(255,71,87,0.35)",
										color: "#ff4757",
										fontFamily: "'Rajdhani', sans-serif",
										fontSize: "13px",
										fontWeight: 700,
										letterSpacing: "0.1em",
										cursor: "pointer",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = "rgba(255,71,87,0.1)";
										e.currentTarget.style.borderColor = "rgba(255,71,87,0.6)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.background = "transparent";
										e.currentTarget.style.borderColor = "rgba(255,71,87,0.35)";
									}}
									onClick={() => leaveQueue.mutate({ serverId, channelId })}
									disabled={leaveQueue.isPending}
								>
									<ArrowLeftOnRectangleIcon className="w-[13px] h-[13px]" />
									{leaveQueue.isPending ? "LEAVING…" : "LEAVE QUEUE"}
								</button>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
