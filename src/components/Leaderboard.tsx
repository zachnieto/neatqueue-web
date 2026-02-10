import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLeaderboardV2 } from "../services/neatqueue-service";
import type { LeaderboardPlayer, LeaderboardV2Response } from "../types";
import { classNames } from "../util/tailwind";
import {
	delay,
	displayPercent,
	getWinRateColor,
	handleKeyDown,
} from "../util/utility";
import ExpandedStats from "./ExpandedStats";

type PlayerData = LeaderboardPlayer["stats"];
type SortKey =
	| Exclude<keyof PlayerData, "ign" | "rank" | "decay" | "parsed_stats">
	| "wl";
type SortDirection = "asc" | "desc";

const TABLE_STATS: SortKey[] = [
	"mmr",
	"wl",
	"wins",
	"losses",
	"totalgames",
	"streak",
	"peak_mmr",
	"peak_streak",
	"winrate",
];

const STAT_LABELS: Record<string, string> = {
	mmr: "MMR",
	wl: "W/L",
	wins: "Wins",
	losses: "Losses",
	totalgames: "Games",
	streak: "Streak",
	peak_mmr: "Peak MMR",
	peak_streak: "Peak Streak",
	winrate: "Win Rate",
	current_rank: "Current Rank",
	rank: "Rank",
	decay: "Decay",
};

const DEFAULT_COLUMNS: SortKey[] = ["mmr", "wl", "winrate"];

interface LeaderboardProps {
	passedGuildId?: string;
	passedChannelId?: string;
}

interface MonthSelectorProps {
	availableMonths: string[];
	selectedMonth: string;
	onMonthChange: (month: string) => void;
	formatMonthDisplay: (month: string) => string;
}

const MonthSelector = ({
	availableMonths,
	selectedMonth,
	onMonthChange,
	formatMonthDisplay,
}: MonthSelectorProps) => {
	if (availableMonths.length <= 1 || availableMonths[0] === "alltime") {
		return null;
	}

	const hasAllTime = availableMonths.includes("alltime");

	const monthList = hasAllTime
		? ["alltime", ...availableMonths.filter((month) => month !== "alltime")]
		: availableMonths;

	return (
		<div className="flex flex-col">
			<span className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide">
				Time Period
			</span>
			<select
				value={selectedMonth}
				onChange={(e) => onMonthChange(e.target.value)}
				className="w-full bg-neutral-900 text-white border border-neutral-700 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-600 cursor-pointer hover:bg-neutral-800 transition-colors"
			>
				{monthList.map((month: string) => (
					<option key={month} value={month}>
						{formatMonthDisplay(month)}
					</option>
				))}
			</select>
		</div>
	);
};

const Leaderboard = ({
	passedGuildId = "",
	passedChannelId = "",
}: LeaderboardProps) => {
	const { guildID, channelID } = useParams();

	const [sortKey, setSortKey] = useQueryState(
		"sort",
		parseAsString.withDefault("mmr"),
	);
	const [selectedMonth, setSelectedMonth] = useQueryState(
		"month",
		parseAsString.withDefault("alltime"),
	);
	const [currentPage, setCurrentPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(1),
	);

	const [visibleColumns, setVisibleColumns] =
		useState<SortKey[]>(DEFAULT_COLUMNS);
	const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
	const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);
	const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);

	const guildId = guildID || passedGuildId;
	const channelId = channelID || passedChannelId;

	const currentMonth = useMemo(() => {
		return new Date().toISOString().slice(0, 7);
	}, []);

	const {
		data: leaderboardData,
		isLoading,
		error,
	} = useQuery<LeaderboardV2Response, Error>({
		queryKey: ["leaderboard", guildId, channelId, selectedMonth, currentPage],
		queryFn: () =>
			getLeaderboardV2(guildId, channelId, currentPage, 100, [
				selectedMonth,
				currentMonth,
			]),
		enabled: !!guildId && !!channelId,
		staleTime: 30000, // 30 seconds
	});

	const showMonthSelector = useMemo(() => {
		if (!leaderboardData) return false;
		return (
			leaderboardData?.available_months.length > 1 &&
			leaderboardData?.available_months[0] !== "alltime"
		);
	}, [leaderboardData]);

	const currentMonthData = useMemo(() => {
		if (!leaderboardData) return null;
		return (
			leaderboardData.months.find((m: any) => m.month === selectedMonth) ||
			leaderboardData.months[0]
		);
	}, [leaderboardData, selectedMonth]);

	// Sort players based on selected sort key and direction
	const sortedPlayers = useMemo(() => {
		if (!currentMonthData?.data) return [];

		return [...currentMonthData.data].sort((a, b) => {
			// For W/L column, sort by wins
			const actualSortKey = sortKey === "wl" ? "wins" : sortKey;
			const aValue = a?.stats?.[actualSortKey as keyof PlayerData];
			const bValue = b?.stats?.[actualSortKey as keyof PlayerData];

			if (aValue == null && bValue == null) return 0;
			if (aValue == null) return 1;
			if (bValue == null) return -1;

			if (typeof aValue === "number" && typeof bValue === "number") {
				return sortDirection === "desc" ? bValue - aValue : aValue - bValue;
			}

			return 0;
		});
	}, [currentMonthData, sortKey, sortDirection]);

	const toggleColumn = (column: SortKey) => {
		setVisibleColumns((prev) => {
			if (prev.includes(column)) {
				// Don't allow removing the last column
				if (prev.length === 1) return prev;
				return prev.filter((c) => c !== column);
			} else {
				// Add the column and sort by TABLE_STATS order
				const newColumns = [...prev, column];
				return newColumns.sort(
					(a, b) => TABLE_STATS.indexOf(a) - TABLE_STATS.indexOf(b),
				);
			}
		});
	};

	const handleColumnHeaderClick = (column: SortKey) => {
		if (sortKey === column) {
			// Toggle direction if clicking the same column
			setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
		} else {
			// Set new sort column and reset to descending
			setSortKey(column);
			setSortDirection("desc");
		}
	};

	const formatMonthDisplay = (month: string) => {
		if (month === "alltime") return "All Time";

		try {
			const [year, monthNum] = month.split("-");
			const date = new Date(parseInt(year), parseInt(monthNum) - 1, 15);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
			});
		} catch {
			return month;
		}
	};

	const formatQueueName = (queueName: string) => {
		// Remove YYYY-MM_ prefix pattern if present
		const cleanedName = queueName.replace(/^\d{4}-\d{2}_/, "");
		return cleanedName.replace(/_/g, " ").toUpperCase();
	};

	const getRankBadge = (rank: number) => {
		if (rank === 1)
			return {
				icon: "👑",
				bg: "bg-gradient-to-r from-yellow-600/30 to-amber-600/30",
				border: "",
			};
		if (rank === 2)
			return {
				icon: "🥈",
				bg: "bg-gradient-to-r from-gray-400/20 to-slate-400/20",
				border: "",
			};
		if (rank === 3)
			return {
				icon: "🥉",
				bg: "bg-gradient-to-r from-orange-700/20 to-orange-600/20",
				border: "",
			};
		return { icon: null, bg: "", border: "" };
	};

	const formatStatValue = (player: LeaderboardPlayer, key: SortKey) => {
		if (key === "wl") {
			const wins = player?.stats?.wins || 0;
			const losses = player?.stats?.losses || 0;
			return `${wins} - ${losses}`;
		}

		const value = player?.stats?.[key as keyof PlayerData];
		if (value == null) return "0";
		if (key === "winrate" && typeof value === "number")
			return displayPercent(value);
		if ((key === "mmr" || key === "peak_mmr") && typeof value === "number")
			return Math.round(value).toString();
		return value?.toString() || "0";
	};

	const fetchAllLeaderboardData = async () => {
		if (!guildId || !channelId || !currentMonthData) {
			return [];
		}

		let totalPages = 100000;
		// Use the actual month from currentMonthData, which already has the correct fallback logic
		const actualMonth = currentMonthData.month;

		const allPlayers: LeaderboardPlayer[] = [];

		// Fetch all pages with rate limiting (30 requests per minute = 1 request every 2 seconds)
		for (let page = 1; page <= totalPages; page++) {
			try {
				console.log(`Fetching page ${page}`, totalPages);
				const data = await getLeaderboardV2(guildId, channelId, page, 500, [
					selectedMonth,
					currentMonth,
				]);

				// Use actualMonth (from currentMonthData) instead of selectedMonth
				const monthData =
					data.months.find((m: any) => m.month === actualMonth) ||
					data.months[0]; // Fallback to first month if not found
				totalPages = monthData.pagination.total_pages;
				if (monthData?.data) {
					allPlayers.push(...monthData.data);
				}

				// Update progress
				setDownloadProgress(Math.round((page / totalPages) * 100));

				if (page < totalPages) {
					await new Promise((resolve) => setTimeout(resolve, 500));
				}
			} catch (error) {
				console.error(`Error fetching page ${page}:`, error);
			}
		}

		return allPlayers;
	};

	const convertToCSV = (players: LeaderboardPlayer[]) => {
		// Define CSV headers
		const headers = [
			"Rank",
			"Player Name",
			"IGN",
			"MMR",
			"Wins",
			"Losses",
			"Total Games",
			"Win Rate",
			"Streak",
			"Peak MMR",
			"Peak Streak",
		];

		// Create CSV rows
		const rows = players.map((player, index) => {
			const rank = index + 1;
			const stats = player.stats;
			return [
				rank,
				`"${player.name.replace(/"/g, '""')}"`, // Escape quotes in name
				stats.ign ? `"${stats.ign.replace(/"/g, '""')}"` : "",
				Math.round(stats.mmr || 0),
				stats.wins || 0,
				stats.losses || 0,
				stats.totalgames || 0,
				`${((stats.winrate || 0) * 100).toFixed(1)}%`,
				stats.streak || 0,
				Math.round(stats.peak_mmr || 0),
				stats.peak_streak || 0,
			].join(",");
		});

		// Combine headers and rows
		return [headers.join(","), ...rows].join("\n");
	};

	const downloadCSV = async () => {
		setIsDownloadingCSV(true);
		setDownloadProgress(0);
		try {
			const allPlayers = await fetchAllLeaderboardData();

			if (allPlayers.length === 0) {
				alert("No player data available to download.");
				return;
			}

			const csv = convertToCSV(allPlayers);

			// Create blob and download
			const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);

			// Generate filename with queue name and month
			const queueName = leaderboardData?.queue_name || "leaderboard";
			const monthDisplay =
				selectedMonth === "alltime" ? "alltime" : selectedMonth;
			const filename = `${queueName}_${monthDisplay}_leaderboard.csv`;

			link.setAttribute("href", url);
			link.setAttribute("download", filename);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error downloading CSV:", error);
			alert("Failed to download CSV. Please try again.");
		} finally {
			setIsDownloadingCSV(false);
			setDownloadProgress(0);
		}
	};

	if (isLoading || !leaderboardData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="relative w-20 h-20 mx-auto mb-6">
						<div className="absolute inset-0 border-4 border-neutral-700 rounded-full"></div>
						<div className="absolute inset-0 border-4 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
					</div>
					<p className="text-xl text-gray-300 font-medium">
						Loading leaderboard...
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
						Error Loading Leaderboard
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
						{formatQueueName(leaderboardData.queue_name)}
					</h1>
				</div>

				<div className="space-y-4">
					{/* Mobile Month Selector - Separate on mobile */}
					{showMonthSelector && (
						<div className="md:hidden">
							<div className="bg-neutral-800 rounded-xl border border-neutral-700 p-2 shadow-2xl">
								<MonthSelector
									availableMonths={leaderboardData.available_months}
									selectedMonth={selectedMonth}
									onMonthChange={(month) => {
										setSelectedMonth(month);
										setCurrentPage(1);
									}}
									formatMonthDisplay={formatMonthDisplay}
								/>
							</div>
						</div>
					)}

					{/* Column Toggle Controls with Desktop Month Selector */}
					<div className="bg-neutral-800 rounded-xl border border-neutral-700 p-2 md:p-4 shadow-2xl">
						{/* Desktop: Combined layout */}
						<div className="hidden md:flex md:items-end md:gap-4">
							<div className="flex-1">
								<span className="text-xs text-gray-400 mb-1.5 font-medium uppercase tracking-wide block">
									Displayed Stats
								</span>
								<div className="flex flex-wrap gap-2">
									{TABLE_STATS.map((stat: SortKey) => (
										<button
											type="button"
											key={stat}
											onClick={() => toggleColumn(stat)}
											className={classNames(
												"px-3 py-1.5 rounded-md font-medium transition-all duration-200 text-xs",
												visibleColumns.includes(stat)
													? "bg-neutral-700 text-white shadow-md"
													: "bg-neutral-800 text-gray-400 hover:bg-neutral-700 hover:text-gray-200",
											)}
										>
											{STAT_LABELS[stat]}
										</button>
									))}
								</div>
							</div>
							{showMonthSelector && (
								<div className="w-48 flex-shrink-0">
									<MonthSelector
										availableMonths={leaderboardData.available_months}
										selectedMonth={selectedMonth}
										onMonthChange={(month) => {
											setSelectedMonth(month);
											setCurrentPage(1);
										}}
										formatMonthDisplay={formatMonthDisplay}
									/>
								</div>
							)}
							<div className="flex gap-2 ml-auto self-end">
								<Link
									to={`/history/${guildId}?queue=${encodeURIComponent(leaderboardData.queue_name)}`}
									className="bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span>Match History</span>
								</Link>
								<button
									type="button"
									onClick={downloadCSV}
									disabled={isDownloadingCSV}
									className={classNames(
										"bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2",
										isDownloadingCSV ? "opacity-50 cursor-not-allowed" : "",
									)}
								>
									{isDownloadingCSV ? (
										<>
											<div className="relative w-4 h-4">
												<svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
													<circle
														cx="18"
														cy="18"
														r="16"
														fill="none"
														className="stroke-neutral-500"
														strokeWidth="3"
													/>
													<circle
														cx="18"
														cy="18"
														r="16"
														fill="none"
														className="stroke-white"
														strokeWidth="3"
														strokeDasharray={`${(downloadProgress * 100.53) / 100} 100.53`}
														strokeLinecap="round"
													/>
													<text
														x="18"
														y="18"
														className="fill-white text-[10px] font-bold"
														textAnchor="middle"
														dominantBaseline="central"
														transform="rotate(90 18 18)"
													>
														{downloadProgress}
													</text>
												</svg>
											</div>
											<span>{downloadProgress}%</span>
										</>
									) : (
										<>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											<span>Download CSV</span>
										</>
									)}
								</button>
							</div>
						</div>

						{/* Mobile: Column toggles and CSV download */}
						<div className="md:hidden">
							<div className="flex flex-wrap gap-1 mb-3">
								{TABLE_STATS.map((stat: SortKey) => (
									<button
										type="button"
										key={stat}
										onClick={() => toggleColumn(stat)}
										className={classNames(
											"px-2 py-1 rounded-md font-medium transition-all duration-200 text-xs",
											visibleColumns.includes(stat)
												? "bg-neutral-700 text-white shadow-md"
												: "bg-neutral-800 text-gray-400 hover:bg-neutral-700 hover:text-gray-200",
										)}
									>
										{STAT_LABELS[stat]}
									</button>
								))}
							</div>
							<div className="flex gap-2">
								<Link
									to={`/history/${guildId}?queue=${encodeURIComponent(leaderboardData.queue_name)}`}
									className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2"
								>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<span>Match History</span>
								</Link>
								<button
									type="button"
									onClick={downloadCSV}
									disabled={isDownloadingCSV}
									className={classNames(
										"flex-1 bg-neutral-700 hover:bg-neutral-600 text-white border border-neutral-600 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 shadow-md flex items-center justify-center gap-2",
										isDownloadingCSV ? "opacity-50 cursor-not-allowed" : "",
									)}
								>
									{isDownloadingCSV ? (
										<>
											<div className="relative w-4 h-4">
												<svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
													<circle
														cx="18"
														cy="18"
														r="16"
														fill="none"
														className="stroke-neutral-500"
														strokeWidth="3"
													/>
													<circle
														cx="18"
														cy="18"
														r="16"
														fill="none"
														className="stroke-white"
														strokeWidth="3"
														strokeDasharray={`${(downloadProgress * 100.53) / 100} 100.53`}
														strokeLinecap="round"
													/>
													<text
														x="18"
														y="18"
														className="fill-white text-[10px] font-bold"
														textAnchor="middle"
														dominantBaseline="central"
														transform="rotate(90 18 18)"
													>
														{downloadProgress}
													</text>
												</svg>
											</div>
											<span>{downloadProgress}%</span>
										</>
									) : (
										<>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
											<span>Download CSV</span>
										</>
									)}
								</button>
							</div>
						</div>
					</div>

					{/* Main Leaderboard */}
					<div>
						{/* Desktop Table View */}
						<div className="hidden md:block bg-neutral-900 rounded-xl border border-neutral-700 shadow-2xl overflow-hidden">
							{/* Table Header */}
							<div className="bg-neutral-800 px-6 py-4 border-b border-neutral-700">
								<div className="flex items-center gap-4">
									<div className="w-16 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
										Rank
									</div>
									<div className="flex-1 min-w-[200px] text-xs font-bold text-gray-400 uppercase tracking-wider">
										Player
									</div>
									{visibleColumns.map((column) => (
										<button
											type="button"
											key={column}
											onClick={() => handleColumnHeaderClick(column)}
											className="min-w-[80px] text-xs font-bold text-gray-300 uppercase tracking-wider text-center hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1"
										>
											<span>{STAT_LABELS[column]}</span>
											{sortKey === column && (
												<span className="text-lg">
													{sortDirection === "desc" ? "↓" : "↑"}
												</span>
											)}
										</button>
									))}
								</div>
							</div>

							{/* Table Body */}
							<div className="divide-y divide-neutral-700">
								{sortedPlayers.length === 0 ? (
									<div className="text-center py-12">
										<p className="text-gray-400">No players found</p>
									</div>
								) : (
									sortedPlayers.map((player, index) => {
										const rank =
											index +
											1 +
											(currentPage - 1) *
												(currentMonthData?.pagination?.per_page || 50);
										const rankInfo = getRankBadge(index + 1);
										const isExpanded = expandedPlayerId === player.id;

										return (
											<div
												key={player.id}
												className={classNames(
													"transition-all duration-200 bg-neutral-800",
													rankInfo.bg,
												)}
											>
												<div
													className={classNames(
														"px-6 py-4 cursor-pointer hover:bg-black/20",
														"transition-colors duration-200",
													)}
													onClick={() =>
														setExpandedPlayerId(isExpanded ? null : player.id)
													}
													onKeyDown={(e) => {
														handleKeyDown(e, () =>
															setExpandedPlayerId(
																isExpanded ? null : player.id,
															),
														);
													}}
												>
													<div className="flex items-center gap-4">
														{/* Rank */}
														<div className="w-16 text-center">
															<div className="flex flex-col items-center justify-center">
																{rankInfo.icon && (
																	<span className="text-2xl mb-1">
																		{rankInfo.icon}
																	</span>
																)}
																<span
																	className={classNames(
																		"text-lg font-bold",
																		rank <= 3 ? "text-white" : "text-gray-300",
																	)}
																>
																	#{rank}
																</span>
															</div>
														</div>

														{/* Player Info */}
														<div className="flex-1 min-w-[200px] flex items-center space-x-3">
															<img
																src={player.avatar_url ?? "/pixelart-logo.png"}
																alt={player.name}
																onError={(e) => {
																	e.currentTarget.src = "/pixelart-logo.png";
																}}
																className="w-12 h-12 rounded-full border-2 border-neutral-600 shadow-lg"
															/>
															<div className="min-w-0">
																<h3 className="text-base font-semibold text-white truncate">
																	{player.name}
																</h3>
																{player?.stats?.ign && (
																	<p className="text-xs text-gray-400 truncate">
																		{player.stats.ign}
																	</p>
																)}
															</div>
														</div>

														{/* Dynamic Stat Columns */}
														{visibleColumns.map((column) => {
															if (column === "winrate") {
																const winrateValue =
																	player?.stats?.winrate || 0;
																const colors = getWinRateColor(winrateValue);
																return (
																	<div
																		key={column}
																		className="min-w-[80px] flex justify-center"
																	>
																		<div
																			className="inline-flex items-center px-3 py-1 rounded border"
																			style={{
																				borderColor: colors.border,
																				backgroundColor: colors.bg,
																			}}
																		>
																			<span className="text-sm font-bold">
																				{displayPercent(winrateValue)}
																			</span>
																		</div>
																	</div>
																);
															}
															return (
																<div
																	key={column}
																	className="min-w-[80px] text-center"
																>
																	<span className="text-base font-semibold text-white">
																		{formatStatValue(player, column)}
																	</span>
																</div>
															);
														})}
													</div>
												</div>

												{/* Expanded Stats View */}
												<div
													className={classNames(
														"overflow-hidden transition-all duration-300 ease-in-out",
														isExpanded
															? "max-h-[2000px] opacity-100"
															: "max-h-0 opacity-0",
													)}
												>
													<div className="border-t border-neutral-800 px-6 py-4 bg-neutral-800/50">
														<ExpandedStats
															player={player}
															variant="desktop"
															guildId={guildId}
															queueName={leaderboardData.queue_name}
															selectedMonth={
																currentMonthData?.month ?? selectedMonth
															}
															isExpanded={isExpanded}
														/>
													</div>
												</div>
											</div>
										);
									})
								)}
							</div>

							{/* Pagination */}
							{currentMonthData?.pagination &&
								currentMonthData.pagination.total_pages > 1 && (
									<div className="bg-neutral-800 px-6 py-4 border-t border-neutral-700">
										<div className="flex items-center justify-between flex-wrap gap-4">
											<div className="text-sm text-gray-400">
												Showing{" "}
												<span className="text-white font-semibold">
													{(currentPage - 1) *
														currentMonthData.pagination.per_page +
														1}
												</span>{" "}
												to{" "}
												<span className="text-white font-semibold">
													{Math.min(
														currentPage * currentMonthData.pagination.per_page,
														currentMonthData.pagination.total_items,
													)}
												</span>{" "}
												of{" "}
												<span className="text-white font-semibold">
													{currentMonthData.pagination.total_items}
												</span>{" "}
												players
											</div>

											<div className="flex items-center space-x-2">
												<button
													type="button"
													onClick={() => setCurrentPage(currentPage - 1)}
													disabled={!currentMonthData.pagination.previous_page}
													className={classNames(
														"px-4 py-2 rounded-lg font-medium transition-all duration-200",
														currentMonthData.pagination.previous_page
															? "bg-neutral-700 hover:bg-neutral-600 text-white shadow-lg"
															: "bg-neutral-800 text-gray-500 cursor-not-allowed",
													)}
												>
													← Previous
												</button>

												<span className="px-4 py-2 text-white font-medium bg-neutral-800 rounded-lg">
													{currentPage} /{" "}
													{currentMonthData.pagination.total_pages}
												</span>

												<button
													type="button"
													onClick={() => setCurrentPage(currentPage + 1)}
													disabled={!currentMonthData.pagination.next_page}
													className={classNames(
														"px-4 py-2 rounded-lg font-medium transition-all duration-200",
														currentMonthData.pagination.next_page
															? "bg-neutral-700 hover:bg-neutral-600 text-white shadow-lg"
															: "bg-neutral-800 text-gray-500 cursor-not-allowed",
													)}
												>
													Next →
												</button>
											</div>
										</div>
									</div>
								)}
						</div>

						{/* Mobile Card View */}
						<div className="md:hidden bg-neutral-900 rounded-xl border border-neutral-700 shadow-2xl overflow-hidden">
							{sortedPlayers.length === 0 ? (
								<div className="p-8 text-center">
									<p className="text-gray-400">No players found</p>
								</div>
							) : (
								<div className="divide-y divide-neutral-700">
									{sortedPlayers.map((player, index) => {
										const rank =
											index +
											1 +
											(currentPage - 1) *
												(currentMonthData?.pagination?.per_page || 50);
										const rankInfo = getRankBadge(index + 1);
										const isExpanded = expandedPlayerId === player.id;

										return (
											<div
												key={player.id}
												className={classNames(
													"transition-all duration-200 bg-neutral-800",
													rankInfo.bg,
												)}
											>
												{/* Compact Row Layout - Clickable */}
												<div
													className="flex items-center gap-2 p-3 cursor-pointer hover:bg-black/20 transition-colors duration-200"
													onClick={() =>
														setExpandedPlayerId(isExpanded ? null : player.id)
													}
													onKeyDown={(e) => {
														handleKeyDown(e, () =>
															setExpandedPlayerId(
																isExpanded ? null : player.id,
															),
														);
													}}
												>
													{/* Rank */}
													<div className="flex flex-col items-center justify-center w-10">
														{rankInfo.icon && (
															<span className="text-lg leading-none">
																{rankInfo.icon}
															</span>
														)}
														<span
															className={classNames(
																"text-xs font-bold",
																rank <= 3 ? "text-white" : "text-gray-300",
															)}
														>
															#{rank}
														</span>
													</div>

													{/* Avatar */}
													<img
														src={player.avatar_url ?? "/pixelart-logo.png"}
														alt={player.name}
														className="w-10 h-10 rounded-full border-2 border-neutral-600"
													/>

													{/* Player Name & Stats */}
													<div className="flex-1 min-w-0">
														<div className="flex items-baseline gap-1.5 mb-1">
															<h3 className="text-sm font-semibold text-white truncate">
																{player.name}
															</h3>
															{player?.stats?.ign && (
																<span className="text-xs text-gray-400 truncate">
																	({player.stats.ign})
																</span>
															)}
														</div>

														{/* Inline Stats */}
														<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
															{visibleColumns.map((column) => {
																if (column === "winrate") {
																	const winrateValue =
																		player?.stats?.winrate || 0;
																	const colors = getWinRateColor(winrateValue);
																	return (
																		<button
																			type="button"
																			key={column}
																			onClick={(e) => {
																				e.stopPropagation();
																				handleColumnHeaderClick(column);
																			}}
																			className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
																		>
																			<span className="text-xs text-gray-400">
																				{STAT_LABELS[column]}:
																			</span>
																			<div
																				className="inline-flex items-center px-1.5 py-0.5 rounded border text-xs font-bold"
																				style={{
																					borderColor: colors.border,
																					backgroundColor: colors.bg,
																				}}
																			>
																				{displayPercent(winrateValue)}
																			</div>
																			{sortKey === column && (
																				<span className="text-xs text-gray-400">
																					{sortDirection === "desc" ? "↓" : "↑"}
																				</span>
																			)}
																		</button>
																	);
																}
																return (
																	<button
																		type="button"
																		key={column}
																		onClick={(e) => {
																			e.stopPropagation();
																			handleColumnHeaderClick(column);
																		}}
																		className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
																	>
																		<span className="text-xs text-gray-400">
																			{STAT_LABELS[column]}:
																		</span>
																		<span className="text-xs font-semibold text-white">
																			{formatStatValue(player, column)}
																		</span>
																		{sortKey === column && (
																			<span className="text-xs text-gray-400">
																				{sortDirection === "desc" ? "↓" : "↑"}
																			</span>
																		)}
																	</button>
																);
															})}
														</div>
													</div>
												</div>

												{/* Expanded Stats View */}
												<div
													className={classNames(
														"overflow-hidden transition-all duration-300 ease-in-out",
														isExpanded
															? "max-h-[2000px] opacity-100"
															: "max-h-0 opacity-0",
													)}
												>
													<div className="border-t border-neutral-800 p-3 bg-neutral-800/50">
														<ExpandedStats
															player={player}
															variant="mobile"
															guildId={guildId}
															queueName={leaderboardData.queue_name}
															selectedMonth={
																currentMonthData?.month ?? selectedMonth
															}
															isExpanded={isExpanded}
														/>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							)}

							{/* Mobile Pagination */}
							{currentMonthData?.pagination &&
								currentMonthData.pagination.total_pages > 1 && (
									<div className="bg-neutral-800 px-4 py-4 border-t border-neutral-700">
										<div className="text-xs text-gray-400 text-center mb-3">
											Page {currentPage} of{" "}
											{currentMonthData.pagination.total_pages}
										</div>
										<div className="flex items-center justify-center gap-2">
											<button
												type="button"
												onClick={() => setCurrentPage(currentPage - 1)}
												disabled={!currentMonthData.pagination.previous_page}
												className={classNames(
													"px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200",
													currentMonthData.pagination.previous_page
														? "bg-neutral-700 hover:bg-neutral-600 text-white shadow-lg"
														: "bg-neutral-800 text-gray-500 cursor-not-allowed",
												)}
											>
												← Prev
											</button>

											<button
												type="button"
												onClick={() => setCurrentPage(currentPage + 1)}
												disabled={!currentMonthData.pagination.next_page}
												className={classNames(
													"px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200",
													currentMonthData.pagination.next_page
														? "bg-neutral-700 hover:bg-neutral-600 text-white shadow-lg"
														: "bg-neutral-800 text-gray-500 cursor-not-allowed",
												)}
											>
												Next →
											</button>
										</div>
									</div>
								)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Leaderboard;
