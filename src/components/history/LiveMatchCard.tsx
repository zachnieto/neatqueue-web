import type { MatchHistory } from "../../types";
import MatchCardHeader from "../ui/MatchCardHeader";

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

			<MatchCardHeader
				title={`${formatQueueName(match.game)} — Match #${match.game_num}`}
				subtitle={new Date(match.time).toLocaleString()}
				serverId={serverId}
				channelId={match.queue_channel}
				status="LIVE"
				variant="live"
			/>

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
