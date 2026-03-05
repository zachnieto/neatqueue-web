import type { MatchHistory } from "../../types";
import { classNames } from "../../util/tailwind";
import MatchCardHeader from "../ui/MatchCardHeader";

interface CompletedMatchCardProps {
	match: MatchHistory;
	formatQueueName: (queueName: string) => string;
	serverId: string;
}

export const CompletedMatchCard = ({
	match,
	formatQueueName,
	serverId,
}: CompletedMatchCardProps) => {
	return (
		<div
			key={`${match.game}_${match.game_num}`}
			className="card-glass rounded-sm"
			style={{
				overflow: "hidden",
				border: "1px solid rgba(255,255,255,0.07)",
				transition: "border-color 0.2s",
			}}
		>
			<MatchCardHeader
				title={`${formatQueueName(match.game)} — Match #${match.game_num}`}
				subtitle={new Date(match.time).toLocaleString()}
				serverId={serverId}
				channelId={match.queue_channel}
			/>

			{/* Content */}
			<div style={{ padding: 16 }}>
				<div className="grid grid-cols-2 gap-3">
					{/* Team 1 */}
					<div
						style={{
							background: "rgba(255,255,255,0.02)",
							border: "1px solid rgba(255,255,255,0.05)",
							borderRadius: 2,
							padding: 12,
						}}
					>
						<div
							className={classNames(
								"font-rajdhani flex items-center justify-between",
								match.winner === 0 ? "text-green-400" : "text-red-400",
							)}
							style={{
								fontSize: 11,
								fontWeight: 700,
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								marginBottom: 8,
							}}
						>
							<span>{match.winner === 0 ? "Winner" : "Loser"}</span>
							<div
								className={classNames(
									"h-2 w-2 rounded-full",
									match.winner === 0 ? "bg-green-400" : "bg-red-400",
								)}
							/>
						</div>
						<div className="space-y-1.5">
							{match.teams[0]?.map((player) => (
								<div
									key={player.id}
									className="flex justify-between items-center"
								>
									<span
										style={{
											color: "#9aa0b4",
											fontSize: 13,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
											marginRight: 8,
										}}
									>
										{player.name}
									</span>
									<span
										className={classNames(
											"font-mono-gaming",
											player.mmr_change >= 0
												? "text-green-400"
												: "text-red-400",
										)}
										style={{ fontSize: 11, fontWeight: 600 }}
									>
										{player.mmr_change > 0 ? "+" : ""}
										{player.mmr_change.toFixed(1)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Team 2 */}
					<div
						style={{
							background: "rgba(255,255,255,0.02)",
							border: "1px solid rgba(255,255,255,0.05)",
							borderRadius: 2,
							padding: 12,
						}}
					>
						<div
							className={classNames(
								"font-rajdhani flex items-center justify-between",
								match.winner === 1 ? "text-green-400" : "text-red-400",
							)}
							style={{
								fontSize: 11,
								fontWeight: 700,
								letterSpacing: "0.08em",
								textTransform: "uppercase",
								marginBottom: 8,
							}}
						>
							<span>{match.winner === 1 ? "Winner" : "Loser"}</span>
							<div
								className={classNames(
									"h-2 w-2 rounded-full",
									match.winner === 1 ? "bg-green-400" : "bg-red-400",
								)}
							/>
						</div>
						<div className="space-y-1.5">
							{match.teams[1]?.map((player) => (
								<div
									key={player.id}
									className="flex justify-between items-center"
								>
									<span
										style={{
											color: "#9aa0b4",
											fontSize: 13,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
											marginRight: 8,
										}}
									>
										{player.name}
									</span>
									<span
										className={classNames(
											"font-mono-gaming",
											player.mmr_change >= 0
												? "text-green-400"
												: "text-red-400",
										)}
										style={{ fontSize: 11, fontWeight: 600 }}
									>
										{player.mmr_change > 0 ? "+" : ""}
										{player.mmr_change.toFixed(1)}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

CompletedMatchCard.Skeleton = () => {
	return (
		<div
			className="card-glass rounded-sm animate-pulse"
			style={{
				overflow: "hidden",
				border: "1px solid rgba(255,255,255,0.07)",
				height: 180,
			}}
		>
			<div
				style={{
					height: 56,
					padding: "16px 20px",
					borderBottom: "1px solid rgba(255,255,255,0.05)",
					display: "flex",
					flexDirection: "column",
					gap: 6,
				}}
			>
				<div className="h-4 bg-white/10 rounded w-2/3" />
				<div className="h-3 bg-white/5 rounded w-1/3" />
			</div>

			<div style={{ padding: 16 }}>
				<div className="grid grid-cols-2 gap-3">
					{[0, 1].map((team) => (
						<div
							key={team}
							style={{
								background: "rgba(255,255,255,0.02)",
								border: "1px solid rgba(255,255,255,0.05)",
								borderRadius: 2,
								padding: 12,
								height: 90,
							}}
						>
							<div className="h-3 bg-white/10 rounded w-1/3 mb-4" />
							<div className="space-y-2">
								<div className="h-3 bg-white/5 rounded w-full" />
								<div className="h-3 bg-white/5 rounded w-4/5" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
