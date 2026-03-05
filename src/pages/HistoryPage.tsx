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
import ServerPageLayout from "../components/ui/ServerPageLayout";
import { getHistory, getServerInfo } from "../services/neatqueue-service";

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

		const formattedDate = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
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

	// Server info for header
	const { data: serverData, isLoading: serverLoading } = useQuery({
		queryKey: ["server", serverId],
		queryFn: () => getServerInfo(serverId ?? ""),
		enabled: !!serverId,
	});

	// React Query for data fetching
	const {
		data: historyData,
		isLoading: historyLoading,
		error,
	} = useQuery({
		queryKey: ["history", serverId, startDate, endDate],
		queryFn: () => getHistory(serverId ?? "", LIMIT_SIZE, startDate, endDate),
		enabled: !!serverId,
		staleTime: 30000, // 30 seconds
	});

	const isLoading = historyLoading || !historyData;

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

	if (!serverId) {
		return (
			<ServerPageLayout
				sectionTitle="Match History"
				sectionSubtitle="View completed and live matches from the last 30 days."
			>
				<p className="section-subtitle" style={{ marginTop: 0 }}>
					No server selected.
				</p>
			</ServerPageLayout>
		);
	}

	if (isLoading || !historyData) {
		return (
			<ServerPageLayout
				serverName={serverData?.info?.name}
				serverIconUrl={serverData?.info?.icon_url}
				memberCount={serverData?.info?.member_count}
				serverHeaderLoading={serverLoading || !serverData}
				sectionTitle="Match History"
				sectionSubtitle="View completed and live matches from the last 30 days."
			>
				<div className="flex items-center justify-center py-24">
					<div className="text-center">
						<div className="relative w-16 h-16 mx-auto mb-6">
							<div
								className="absolute inset-0 rounded-full"
								style={{ border: "3px solid rgba(255,255,255,0.06)" }}
							/>
							<div
								className="absolute inset-0 rounded-full animate-spin"
								style={{
									border: "3px solid transparent",
									borderTopColor: "#00b4ff",
								}}
							/>
						</div>
						<p className="section-subtitle" style={{ marginTop: 0 }}>
							Loading match history...
						</p>
					</div>
				</div>
			</ServerPageLayout>
		);
	}

	if (error) {
		return (
			<ServerPageLayout
				serverName={serverData?.info?.name}
				serverIconUrl={serverData?.info?.icon_url}
				memberCount={serverData?.info?.member_count}
				serverHeaderLoading={serverLoading || !serverData}
				sectionTitle="Match History"
				sectionSubtitle="View completed and live matches from the last 30 days."
			>
				<div
					className="card-glass"
					style={{
						maxWidth: 420,
						padding: 32,
						border: "1px solid rgba(255,71,87,0.2)",
						borderRadius: 2,
						textAlign: "center",
						margin: "0 auto",
					}}
				>
					<div
						style={{
							width: 48,
							height: 48,
							borderRadius: "50%",
							background: "rgba(255,71,87,0.1)",
							border: "1px solid rgba(255,71,87,0.25)",
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							marginBottom: 16,
							fontSize: 20,
						}}
					>
						⚠
					</div>
					<h2
						className="font-rajdhani"
						style={{
							fontSize: 20,
							fontWeight: 700,
							color: "#ff4757",
							letterSpacing: "0.04em",
							marginBottom: 8,
						}}
					>
						ERROR LOADING MATCH HISTORY
					</h2>
					<p className="section-subtitle" style={{ marginTop: 0 }}>
						{(error as Error).message || "Unknown error"}
					</p>
				</div>
			</ServerPageLayout>
		);
	}

	return (
		<ServerPageLayout
			serverName={serverData?.info?.name}
			serverIconUrl={serverData?.info?.icon_url}
			memberCount={serverData?.info?.member_count}
			serverHeaderLoading={serverLoading || !serverData}
			sectionTitle="Match History"
			sectionSubtitle="View completed and live matches from the last 30 days."
		>
			{/* Queue Selector */}
			<div style={{ marginBottom: 32 }}>
				<div
					className="card-glass"
					style={{
						maxWidth: 280,
						padding: "16px 20px",
						border: "1px solid rgba(255,255,255,0.07)",
						borderRadius: 2,
					}}
				>
					<label
						htmlFor={queueSelectorId}
						className="font-rajdhani"
						style={{
							display: "block",
							fontSize: 11,
							fontWeight: 700,
							color: "#5a6078",
							letterSpacing: "0.08em",
							textTransform: "uppercase",
							marginBottom: 8,
						}}
					>
						Queue Filter
					</label>
					<select
						id={queueSelectorId}
						className="input-field"
						style={{ cursor: "pointer" }}
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
				<div style={{ marginBottom: 32 }}>
					<div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
						<h2
							className="font-rajdhani"
							style={{
								fontSize: 22,
								fontWeight: 700,
								color: "#e8eaf0",
								letterSpacing: "0.04em",
								textTransform: "uppercase",
							}}
						>
							Live Matches
						</h2>
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
						<div
							className="card-glass"
							style={{
								padding: "48px 24px",
								border: "1px solid rgba(255,255,255,0.06)",
								borderRadius: 2,
								textAlign: "center",
							}}
						>
							<p className="section-subtitle" style={{ marginTop: 0 }}>
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
		</ServerPageLayout>
	);
}
