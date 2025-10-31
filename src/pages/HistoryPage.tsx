import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { addDays, format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

interface Player {
	name: string;
	id: number;
	mmr: number;
	mmr_change: number;
	team_num: number;
}

interface MatchHistory {
	game: string;
	time: string;
	teams: Player[][];
	winner: number;
	game_num: number;
	lobby_details: string;
	team_names: string[];
}

interface ApiResponse {
	data: MatchHistory[];
	total?: number;
}

function formatQueueName(queueName: string): {
	displayName: string;
	formattedDate: string;
	fullName: string;
} {
	const [datePart, ...queueParts] = queueName.split("_");

	const [year, month] = datePart.split("-");
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];

	const formattedDate = `${monthNames[parseInt(month) - 1]} ${year}`;
	const queueDisplayName = queueParts.join(" ");

	return {
		displayName: queueDisplayName,
		formattedDate: formattedDate,
		fullName: `${formattedDate} - ${queueDisplayName}`,
	};
}

export default function HistoryPage() {
	const { serverId } = useParams();
	const [matches, setMatches] = useState<MatchHistory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedQueue, setSelectedQueue] = useState<string>("all");
	const [availableQueues, setAvailableQueues] = useState<string[]>([]);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const LIMIT_SIZE = 1000;
	const MATCHES_PER_PAGE = 30;

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				setLoading(true);
				const today = new Date();
				const startDate = format(subDays(today, 30), "yyyy-MM-dd");
				const endDate = format(addDays(today, 1), "yyyy-MM-dd");

				const response = await fetch(
					`https://api.neatqueue.com/api/history/${serverId}?limit=${LIMIT_SIZE}&start_date=${startDate}&end_date=${endDate}`,
				);

				if (!response.ok) {
					throw new Error("Error loading match history");
				}

				const data: ApiResponse = await response.json();

				if (!data || !Array.isArray(data.data)) {
					throw new Error("Invalid response format");
				}

				const queues = [...new Set(data.data.map((match) => match.game))];
				setAvailableQueues(queues);
				setMatches(data.data);
			} catch (err) {
				console.error("Error fetching history:", err);
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setLoading(false);
				setIsLoadingMore(false);
			}
		};

		if (serverId) {
			fetchHistory();
		}
	}, [serverId]);

	const filteredMatches =
		selectedQueue === "all"
			? matches
			: matches.filter((match) => match.game === selectedQueue);

	const liveMatches = filteredMatches.filter((match) => match.winner === -2);
	const completedMatches = filteredMatches
		.filter((match) => match.winner !== -1 && match.winner !== -2)
		.sort((a, b) => b.game_num - a.game_num);

	// Paginación
	const totalPages = Math.ceil(completedMatches.length / MATCHES_PER_PAGE);
	const paginatedMatches = completedMatches.slice(
		(currentPage - 1) * MATCHES_PER_PAGE,
		currentPage * MATCHES_PER_PAGE,
	);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
		window.scrollTo(0, 0);
	};

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Alert color="bg-red-600" value={error} setValue={setError} />
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-2xl font-bold mb-6">Match History</h1>

			<div className="mb-6">
				<select
					className="bg-gray-800 text-white rounded-lg p-2 w-full max-w-xs border border-gray-700 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 outline-none"
					value={selectedQueue}
					onChange={(e) => setSelectedQueue(e.target.value)}
				>
					<option value="all">All Queues</option>
					{availableQueues.map((queue) => (
						<option key={queue} value={queue}>
							{formatQueueName(queue).fullName}
						</option>
					))}
				</select>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Partidas en vivo */}
				{liveMatches.length > 0 && (
					<div className="col-span-full mb-4">
						<h2 className="text-xl font-medium mb-4 flex items-center gap-2">
							Live Matches
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
								<span className="w-2 h-2 rounded-full bg-red-400 mr-1 animate-pulse" />
								LIVE
							</span>
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{liveMatches.map((match) => (
								<div
									key={`${match.game}_${match.game_num}`}
									className="bg-gradient-to-br from-red-900/20 to-gray-800/50 rounded-lg overflow-hidden border border-red-500/20 shadow-lg"
								>
									{/* Header */}
									<div className="flex items-center px-4 py-2 bg-red-900/30">
										<div className="flex-1">
											<div className="text-white font-medium">
												{formatQueueName(match.game).displayName} - Match #
												{match.game_num}
											</div>
											<div className="text-gray-400 text-sm mt-0.5">
												{new Date(match.time).toLocaleString()}
											</div>
										</div>
										<div className="flex-shrink-0">
											<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
												<span className="w-2 h-2 rounded-full bg-red-400 mr-1 animate-pulse" />
												LIVE
											</span>
										</div>
									</div>

									{/* Contenido */}
									<div className="p-4">
										<div className="grid grid-cols-2 gap-4">
											{match.teams.map((team, index) => (
												<div
													key={index}
													className="bg-gray-900/50 rounded-lg p-3 border border-red-500/20"
												>
													<div className="text-sm mb-3 font-medium text-gray-300">
														Team {index + 1}
													</div>
													<div className="space-y-2">
														{team.map((player) => (
															<div
																key={player.id}
																className="flex justify-between items-center"
															>
																<span className="text-gray-300 text-sm truncate mr-2">
																	{player.name}
																</span>
																<span className="text-gray-400 text-sm">
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
							))}
						</div>
					</div>
				)}

				{/* Partidas completadas usando paginatedMatches en lugar de completedMatches */}
				{paginatedMatches.map((match) => (
					<div
						key={`${match.game}_${match.game_num}`}
						className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50"
					>
						{/* Header con fecha y queue */}
						<div className="flex justify-between items-center px-4 py-2 bg-gray-700/30">
							<div className="text-white font-medium">
								{formatQueueName(match.game).displayName} - Match #
								{match.game_num}
							</div>
							<div className="text-gray-400 text-sm">
								{new Date(match.time).toLocaleString()}
							</div>
						</div>

						{/* Contenido principal */}
						<div className="p-4">
							{/* Equipos */}
							<div className="grid grid-cols-2 gap-4">
								{/* Equipo 1 */}
								<div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
									<div
										className={`text-sm mb-3 font-medium flex items-center justify-between ${
											match.winner === 0 ? "text-green-400" : "text-red-400"
										}`}
									>
										<span>
											{match.winner === 0 ? "Winner Team" : "Loser Team"}
										</span>
										<div
											className={`h-2 w-2 rounded-full ${
												match.winner === 0 ? "bg-green-400" : "bg-red-400"
											}`}
										/>
									</div>
									<div className="space-y-2">
										{match.teams[0].map((player) => (
											<div
												key={player.id}
												className="flex justify-between items-center"
											>
												<span className="text-gray-300 text-sm truncate mr-2">
													{player.name}
												</span>
												<span
													className={`text-sm ${
														player.mmr_change >= 0
															? "text-green-400"
															: "text-red-400"
													}`}
												>
													{player.mmr_change > 0 ? "+" : ""}
													{player.mmr_change.toFixed(1)}
												</span>
											</div>
										))}
									</div>
								</div>

								{/* Equipo 2 */}
								<div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
									<div
										className={`text-sm mb-3 font-medium flex items-center justify-between ${
											match.winner === 1 ? "text-green-400" : "text-red-400"
										}`}
									>
										<span>
											{match.winner === 1 ? "Winner Team" : "Loser Team"}
										</span>
										<div
											className={`h-2 w-2 rounded-full ${
												match.winner === 1 ? "bg-green-400" : "bg-red-400"
											}`}
										/>
									</div>
									<div className="space-y-2">
										{match.teams[1].map((player) => (
											<div
												key={player.id}
												className="flex justify-between items-center"
											>
												<span className="text-gray-300 text-sm truncate mr-2">
													{player.name}
												</span>
												<span
													className={`text-sm ${
														player.mmr_change >= 0
															? "text-green-400"
															: "text-red-400"
													}`}
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
				))}

				{/* Mensaje cuando no hay partidas */}
				{liveMatches.length === 0 && completedMatches.length === 0 && (
					<div className="text-center text-gray-400 col-span-2">
						No matches found in history
					</div>
				)}
			</div>

			{/* Paginación */}
			{totalPages > 1 && (
				<div className="flex justify-center items-center gap-4 mt-8">
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</button>

					<span className="text-gray-400">
						Page {currentPage} of {totalPages}
					</span>

					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<ChevronRightIcon className="h-5 w-5" />
					</button>
				</div>
			)}
		</div>
	);
}
