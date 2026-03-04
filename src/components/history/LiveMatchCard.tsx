import { Link } from "react-router-dom";
import type { MatchHistory } from "../../types";

interface LiveMatchCardProps {
	match: MatchHistory;
	formatQueueName: (queueName: string) => string;
	serverId: string;
}

export const LiveMatchCard = ({
	match,
	formatQueueName,
	serverId,
}: LiveMatchCardProps) => {
	return (
		<div
			key={`${match.game}_${match.game_num}`}
			className="card-glass rounded-sm"
			style={{
				overflow: "hidden",
				border: "1px solid rgba(255,71,87,0.2)",
				transition: "border-color 0.2s",
			}}
		>
			{/* Top red accent */}
			<div
				style={{
					height: 2,
					background:
						"linear-gradient(90deg, rgba(255,71,87,0.5), transparent)",
				}}
			/>

			{/* Header */}
			<div
				className="flex items-center justify-between gap-2"
				style={{
					padding: "12px 16px",
					background: "rgba(255,71,87,0.04)",
					borderBottom: "1px solid rgba(255,71,87,0.1)",
				}}
			>
				<div style={{ flex: 1, minWidth: 0 }}>
					<div
						className="font-rajdhani"
						style={{
							fontSize: 14,
							fontWeight: 700,
							color: "#e8eaf0",
							letterSpacing: "0.04em",
						}}
					>
						{formatQueueName(match.game)} — Match #{match.game_num}
					</div>
					<div
						className="section-subtitle"
						style={{ marginTop: 2, fontSize: 11 }}
					>
						{new Date(match.time).toLocaleString()}
					</div>
				</div>
				<div className="flex-shrink-0 flex items-center gap-2">
					<Link
						to={`/leaderboard/${serverId}/${match.queue_channel}`}
						className="btn-action"
						style={{
							padding: "4px 12px",
							fontSize: 11,
							whiteSpace: "nowrap",
						}}
					>
						LEADERBOARD
					</Link>
					<span
						className="badge-live"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 4,
							padding: "3px 8px",
							borderRadius: 2,
							background: "rgba(255,71,87,0.12)",
							border: "1px solid rgba(255,71,87,0.3)",
							fontFamily: "'JetBrains Mono', monospace",
							fontSize: 10,
							fontWeight: 700,
							color: "#ff4757",
							letterSpacing: "0.08em",
						}}
					>
						<span
							style={{
								width: 6,
								height: 6,
								borderRadius: "50%",
								background: "#ff4757",
							}}
						/>
						LIVE
					</span>
				</div>
			</div>

			{/* Content */}
			<div style={{ padding: 16 }}>
				<div className="grid grid-cols-2 gap-3">
					{match.teams.map((team, teamIndex) => (
						<div
							key={`${match.game_num}-team-${teamIndex}`}
							style={{
								background: "rgba(255,255,255,0.02)",
								border: "1px solid rgba(255,71,87,0.1)",
								borderRadius: 2,
								padding: 12,
							}}
						>
							<div
								className="font-rajdhani"
								style={{
									fontSize: 11,
									fontWeight: 700,
									color: "#9aa0b4",
									letterSpacing: "0.08em",
									textTransform: "uppercase",
									marginBottom: 8,
								}}
							>
								Team {teamIndex + 1}
							</div>
							<div className="space-y-1.5">
								{team.map((player) => (
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
											className="font-mono-gaming"
											style={{
												fontSize: 11,
												color: "#5a6078",
											}}
										>
											In Progress
										</span>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
