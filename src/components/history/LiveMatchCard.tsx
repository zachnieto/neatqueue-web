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
			className="bg-gradient-to-br from-red-900/20 to-neutral-800 rounded-xl overflow-hidden border border-red-500/20 shadow-2xl"
		>
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-3 bg-red-900/30 border-b border-red-500/20">
				<div className="flex-1">
					<div className="text-white font-semibold">
						{formatQueueName(match.game)} - Match #{match.game_num}
					</div>
					<div className="text-gray-400 text-xs mt-0.5">
						{new Date(match.time).toLocaleString()}
					</div>
				</div>
				<div className="flex-shrink-0 flex items-center gap-2">
					<Link
						to={`/leaderboard/${serverId}/${match.queue_channel}`}
						className="px-2 py-1 rounded text-xs font-medium bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
					>
						Leaderboard
					</Link>
					<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/30 text-red-300">
						<span className="w-2 h-2 rounded-full bg-red-400 mr-1 animate-pulse" />
						LIVE
					</span>
				</div>
			</div>

			{/* Content */}
			<div className="p-4">
				<div className="grid grid-cols-2 gap-3">
					{match.teams.map((team, teamIndex) => (
						<div
							key={`${match.game_num}-team-${teamIndex}`}
							className="bg-neutral-900/70 rounded-lg p-3 border border-red-500/20"
						>
							<div className="text-xs mb-2 font-semibold text-gray-300 uppercase tracking-wide">
								Team {teamIndex + 1}
							</div>
							<div className="space-y-1.5">
								{team.map((player) => (
									<div
										key={player.id}
										className="flex justify-between items-center"
									>
										<span className="text-gray-300 text-sm truncate mr-2">
											{player.name}
										</span>
										<span className="text-gray-400 text-xs">In Progress</span>
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
