import { Link } from "react-router-dom";
import { classNames } from "../../util/tailwind";
import type { MatchHistory } from "../../types";

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
			className="bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 shadow-2xl transition-all duration-200 hover:border-neutral-600"
		>
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 py-3 bg-neutral-800/50 border-b border-neutral-700 gap-2">
				<div className="flex-1 min-w-0">
					<div className="text-white font-semibold text-sm">
						{formatQueueName(match.game)} - Match #{match.game_num}
					</div>
					<div className="text-gray-400 text-xs">
						{new Date(match.time).toLocaleString()}
					</div>
				</div>
				<Link
					to={`/leaderboard/${serverId}/${match.queue_channel}`}
					className="px-3 py-1.5 rounded text-xs font-medium bg-neutral-700 hover:bg-neutral-600 text-white transition-colors whitespace-nowrap"
				>
					Leaderboard
				</Link>
			</div>

			{/* Content */}
			<div className="p-4">
				<div className="grid grid-cols-2 gap-3">
					{/* Team 1 */}
					<div className="bg-neutral-900/70 rounded-lg p-3 border border-neutral-700/50">
						<div
							className={classNames(
								"text-xs mb-2 font-semibold flex items-center justify-between uppercase tracking-wide",
								match.winner === 0 ? "text-green-400" : "text-red-400",
							)}
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
									<span className="text-gray-300 text-sm truncate mr-2">
										{player.name}
									</span>
									<span
										className={classNames(
											"text-xs font-semibold",
											player.mmr_change >= 0
												? "text-green-400"
												: "text-red-400",
										)}
									>
										{player.mmr_change > 0 ? "+" : ""}
										{player.mmr_change.toFixed(1)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Team 2 */}
					<div className="bg-neutral-900/70 rounded-lg p-3 border border-neutral-700/50">
						<div
							className={classNames(
								"text-xs mb-2 font-semibold flex items-center justify-between uppercase tracking-wide",
								match.winner === 1 ? "text-green-400" : "text-red-400",
							)}
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
									<span className="text-gray-300 text-sm truncate mr-2">
										{player.name}
									</span>
									<span
										className={classNames(
											"text-xs font-semibold",
											player.mmr_change >= 0
												? "text-green-400"
												: "text-red-400",
										)}
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
