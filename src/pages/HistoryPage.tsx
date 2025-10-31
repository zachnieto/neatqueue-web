import { useQuery } from "@tanstack/react-query";
import { addDays, format, subDays } from "date-fns";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useId, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
	CompletedMatchCard,
	LiveMatchCard,
	MatchPagination,
} from "../components/history";
import { getHistory } from "../services/neatqueue-service";

function formatQueueName(queueName: string): string {
	// Check if the queue name has a date prefix (YYYY-MM_)
	const datePattern = /^\d{4}-\d{2}_/;
	const hasDatePrefix = datePattern.test(queueName);

	if (hasDatePrefix) {
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
		const queueDisplayName = queueParts.join(" ").toUpperCase();

		return `${formattedDate} - ${queueDisplayName}`;
	} else {
		// No date prefix, just format the queue name
		return queueName.replace(/_/g, " ").toUpperCase();
	}
}

export default function HistoryPage() {
	const { serverId } = useParams();
	const queueSelectorId = useId();

	// URL state management with nuqs
	const [selectedQueue, setSelectedQueue] = useQueryState(
		"queue",
		parseAsString.withDefault("all"),
	);
	const [currentPage, setCurrentPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(1),
	);

	const LIMIT_SIZE = 1000;
	const MATCHES_PER_PAGE = 30;

	// Date range for fetching history
	const { startDate, endDate } = useMemo(() => {
		const today = new Date();
		return {
			startDate: format(subDays(today, 30), "yyyy-MM-dd"),
			endDate: format(addDays(today, 1), "yyyy-MM-dd"),
		};
	}, []);

	// React Query for data fetching
	const {
		data: historyData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["history", serverId, startDate, endDate],
		queryFn: () => getHistory(serverId || "", LIMIT_SIZE, startDate, endDate),
		enabled: !!serverId,
		staleTime: 30000, // 30 seconds
	});

	// Compute available queues
	const availableQueues = useMemo(() => {
		if (!historyData?.data) return [];
		return [...new Set(historyData.data.map((match) => match.game))];
	}, [historyData]);

	// Filter and sort matches
	const { liveMatches, completedMatches } = useMemo(() => {
		if (!historyData?.data) return { liveMatches: [], completedMatches: [] };

		const filteredMatches =
			selectedQueue === "all"
				? historyData.data
				: historyData.data.filter((match) => match.game === selectedQueue);

		// Filter live matches: winner === -2 AND not older than 7 days
		const oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

		const live = filteredMatches.filter(
			(match) => match.winner === -2 && new Date(match.time) > oneWeekAgo,
		);

		const completed = filteredMatches
			.filter((match) => match.winner !== -1 && match.winner !== -2)
			.sort((a, b) => b.game_num - a.game_num);

		return { liveMatches: live, completedMatches: completed };
	}, [historyData, selectedQueue]);

	// Pagination
	const totalPages = Math.ceil(completedMatches.length / MATCHES_PER_PAGE);
	const paginatedMatches = useMemo(() => {
		return completedMatches.slice(
			(currentPage - 1) * MATCHES_PER_PAGE,
			currentPage * MATCHES_PER_PAGE,
		);
	}, [completedMatches, currentPage]);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	if (isLoading || !historyData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="relative w-20 h-20 mx-auto mb-6">
						<div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
						<div className="absolute inset-0 border-4 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
					</div>
					<p className="text-xl text-gray-300 font-medium">
						Loading match history...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center max-w-md mx-auto p-8 bg-red-900/20 border border-red-500/30 rounded-xl">
					<div className="text-5xl mb-4">⚠️</div>
					<h2 className="text-2xl font-bold text-red-400 mb-2">
						Error Loading Match History
					</h2>
					<p className="text-gray-400">
						{(error as Error).message || "Unknown error"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-8 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-6 text-center">
					<h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
						Match History
					</h1>
				</div>

				{/* Queue Selector */}
				<div className="mb-6">
					<div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 shadow-2xl max-w-xs mx-auto">
						<label
							htmlFor={queueSelectorId}
							className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide block"
						>
							Queue Filter
						</label>
						<select
							id={queueSelectorId}
							className="w-full bg-neutral-900 text-white border border-neutral-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-600 cursor-pointer hover:bg-neutral-800 transition-colors"
							value={selectedQueue}
							onChange={(e) => {
								setSelectedQueue(e.target.value);
								setCurrentPage(1);
							}}
						>
							<option value="all">ALL QUEUES</option>
							{availableQueues.map((queue) => (
								<option key={queue} value={queue}>
									{formatQueueName(queue)}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Live Matches Section - Only show on page 1 */}
				{currentPage === 1 && liveMatches.length > 0 && (
					<div className="mb-6">
						<h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
							Live Matches
							<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
								<span className="w-2 h-2 rounded-full bg-red-400 mr-1 animate-pulse" />
								LIVE
							</span>
						</h2>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{liveMatches.map((match) => (
								<LiveMatchCard
									key={`${match.game}_${match.game_num}`}
									match={match}
									formatQueueName={formatQueueName}
									serverId={serverId || ""}
								/>
							))}
						</div>
					</div>
				)}

				{/* Completed Matches Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{paginatedMatches.map((match) => (
						<CompletedMatchCard
							key={`${match.game}_${match.game_num}`}
							match={match}
							formatQueueName={formatQueueName}
							serverId={serverId || ""}
						/>
					))}

					{/* Empty State */}
					{liveMatches.length === 0 && completedMatches.length === 0 && (
						<div className="col-span-full">
							<div className="bg-neutral-800 rounded-xl border border-neutral-700 p-12 text-center">
								<p className="text-gray-400 text-lg">
									No matches found in the last 30 days
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Pagination */}
				<MatchPagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	);
}
