import HighchartsReact from "@highcharts/react/Highcharts";
import { useQuery } from "@tanstack/react-query";
import Highcharts from "highcharts";
import { useEffect, useMemo, useState } from "react";
import { getPlayerStats } from "../services/neatqueue-service";
import type { LeaderboardPlayer, QueueGame, QueueGameData } from "../types";
import { classNames } from "../util/tailwind";
import {
	displayPercent,
	getWinRateColor,
	type WinRateColors,
} from "../util/utility";

type PlayerData = LeaderboardPlayer["stats"];

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

const IGNORED_STATS: (keyof PlayerData)[] = ["current_rank", "decay"];

const numberFormatter = new Intl.NumberFormat("en-US");
const decimalFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 1,
	minimumFractionDigits: 0,
});
const twoDecimalFormatter = new Intl.NumberFormat("en-US", {
	maximumFractionDigits: 2,
	minimumFractionDigits: 0,
});

const TOP_LEVEL_STATS_ORDER = [
	"current_rank",
	"rank",
	"mmr",
	"winrate",
	"wl",
	"peak_mmr",
	"wins",
	"losses",
	"streak",
	"peak_streak",
	"totalgames",
	"decay",
] as const;

const formatStatLabel = (key: string) => {
	if (STAT_LABELS[key]) {
		return STAT_LABELS[key];
	}

	return key
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

const formatNumericValue = (value: number, key?: string) => {
	if (key === "winrate") {
		return displayPercent(value);
	}

	if (key && ["mmr", "peak_mmr", "current_rank", "rank"].includes(key)) {
		return Math.round(value).toLocaleString();
	}

	if (Number.isInteger(value) || value > 1000) {
		return Math.round(value).toLocaleString();
	}

	if (value > 100) {
		return decimalFormatter.format(value);
	}

	return twoDecimalFormatter.format(value);
};

type StatEntry = {
	key: string;
	statKey: string;
	label: string;
	value: string;
	highlight?: WinRateColors;
};

type GroupedStatValueKind = "total" | "avg" | "highest" | "lowest";

type GroupedStatValue = {
	kind: GroupedStatValueKind;
	label: string;
	value: string;
	rawKey: string;
};

type GroupedStat = {
	baseName: string;
	baseLabel: string;
	values: GroupedStatValue[];
};

type StatSelection = {
	type: "topLevel" | "parsed";
	key: string;
	label: string;
};

type ChartPoint = {
	x: number;
	y: number;
	custom: {
		gameNumber: number;
		timestamp: string;
		result: string;
		formattedValue: string;
	};
};

const buildTopLevelStatEntries = (player: LeaderboardPlayer): StatEntry[] => {
	const stats = player?.stats;
	if (!stats) return [];

	const statsRecord = stats as PlayerData & Record<string, unknown>;
	const rawKeys = Object.keys(statsRecord).filter(
		(key) => !IGNORED_STATS.includes(key as keyof PlayerData),
	);
	const orderedKeys: string[] = [];

	TOP_LEVEL_STATS_ORDER.forEach((key) => {
		if (key === "wl") {
			if (typeof stats.wins === "number" && typeof stats.losses === "number") {
				orderedKeys.push("wl");
			}
			return;
		}

		if (rawKeys.includes(key)) {
			orderedKeys.push(key);
		}
	});

	rawKeys.forEach((key) => {
		if (!orderedKeys.includes(key)) {
			orderedKeys.push(key);
		}
	});

	const entries: StatEntry[] = [];

	orderedKeys.forEach((key) => {
		if (key === "wl") {
			if (typeof stats.wins === "number" && typeof stats.losses === "number") {
				const winsDisplay = numberFormatter.format(stats.wins);
				const lossesDisplay = numberFormatter.format(stats.losses);
				entries.push({
					key: "wl",
					statKey: "wl",
					label: formatStatLabel("wl"),
					value: `${winsDisplay} - ${lossesDisplay}`,
				});
			}
			return;
		}

		const value = statsRecord[key];
		if (typeof value !== "number") {
			return;
		}

		const formatted = formatNumericValue(value, key);
		if (key === "winrate") {
			const colors = getWinRateColor(value);
			entries.push({
				key,
				statKey: key,
				label: formatStatLabel(key),
				value: formatted,
				highlight: colors,
			});
		} else {
			entries.push({
				key,
				statKey: key,
				label: formatStatLabel(key),
				value: formatted,
			});
		}
	});

	return entries;
};

const buildParsedStatEntries = (player: LeaderboardPlayer): GroupedStat[] => {
	const parsedStats = player?.stats?.parsed_stats;
	if (!parsedStats) return [];

	// Group stats by their base name
	const groupedMap = new Map<string, GroupedStat>();
	const order: GroupedStatValueKind[] = ["total", "avg", "highest", "lowest"];
	const labelMap: Record<GroupedStatValueKind, string> = {
		total: "Total",
		avg: "Average",
		highest: "Highest",
		lowest: "Lowest",
	};

	Object.entries(parsedStats).forEach(([key, value]) => {
		if (value == null || key.startsWith("count_")) return;
		if (typeof value !== "number") return;

		let baseName = key;
		let statType: GroupedStatValueKind = "total";

		if (key.startsWith("avg_")) {
			baseName = key.slice(4);
			statType = "avg";
		} else if (key.startsWith("highest_")) {
			baseName = key.slice(8);
			statType = "highest";
		} else if (key.startsWith("lowest_")) {
			baseName = key.slice(7);
			statType = "lowest";
		}

		if (!groupedMap.has(baseName)) {
			groupedMap.set(baseName, {
				baseName,
				baseLabel: formatStatLabel(baseName),
				values: [],
			});
		}

		const group = groupedMap.get(baseName)!;
		group.values.push({
			kind: statType,
			label: labelMap[statType],
			value: formatNumericValue(value, key),
			rawKey: key,
		});
	});

	return Array.from(groupedMap.values())
		.map((group) => ({
			...group,
			values: group.values.sort(
				(a, b) => order.indexOf(a.kind) - order.indexOf(b.kind),
			),
		}))
		.filter((group) => group.values.length > 0);
};

const stripQueuePrefix = (queueName: string) =>
	queueName?.replace(/^((?:\d{4}-\d{2}_)|GLOBAL_)/i, "") ?? "";

const getQueueNameForMonth = (month: string, baseQueueName: string) => {
	if (!baseQueueName) return baseQueueName;
	if (!month || month.toLowerCase() === "alltime") {
		return baseQueueName;
	}

	const normalizedMonth = month.split("_")[0];
	return `${normalizedMonth}_${stripQueuePrefix(baseQueueName)}`;
};

const parseTimestampToMs = (timestamp?: string): number | null => {
	if (!timestamp) return null;
	const normalized = timestamp.replace(" ", "T");
	const withTimezone = new Date(`${normalized}Z`);
	if (!Number.isNaN(withTimezone.getTime())) {
		return withTimezone.getTime();
	}

	const fallback = new Date(normalized);
	return Number.isNaN(fallback.getTime()) ? null : fallback.getTime();
};

const getStatValueFromGame = (
	game: QueueGame,
	selection: StatSelection,
): number | null => {
	if (selection.type === "parsed") {
		return game.updated_stats?.parsed_stats?.[selection.key] ?? null;
	}

	switch (selection.key) {
		case "wl": {
			const winsRaw = game.updated_stats?.wins;
			const lossesRaw = game.updated_stats?.losses;

			if (winsRaw == null || lossesRaw == null) return null;
			return winsRaw - lossesRaw;
		}
		case "winrate": {
			const wins = game.updated_stats?.wins;
			const totalGames = game.updated_stats?.totalgames;

			if (wins == null || totalGames == null) return null;
			return wins / totalGames;
		}
		default: {
			const value =
				game[selection.key as keyof QueueGame] ??
				game.updated_stats?.[selection.key];
			if (value == null) return null;
			return value as number;
		}
	}
};

const ExpandedStats = ({
	player,
	variant,
	guildId,
	queueName,
	selectedMonth,
	isExpanded,
}: {
	player: LeaderboardPlayer;
	variant: "desktop" | "mobile";
	guildId: string;
	queueName: string;
	selectedMonth: string;
	isExpanded: boolean;
}) => {
	const topLevelEntries = useMemo(
		() => buildTopLevelStatEntries(player),
		[player],
	);
	const parsedStatGroups = useMemo(
		() => buildParsedStatEntries(player),
		[player],
	);
	const [selectedStat, setSelectedStat] = useState<StatSelection>({
		type: "topLevel",
		key: "mmr",
		label: formatStatLabel("mmr"),
	});
	const [xAxisMode, setXAxisMode] = useState<"game" | "date">("game");

	const resolvedQueueName = useMemo(
		() => getQueueNameForMonth(selectedMonth, queueName),
		[selectedMonth, queueName],
	);

	useEffect(() => {
		const mmrEntry = topLevelEntries.find((entry) => entry.statKey === "mmr");
		if (mmrEntry) {
			setSelectedStat({
				type: "topLevel",
				key: "mmr",
				label: mmrEntry.label,
			});
			setXAxisMode("game");
			return;
		}

		if (topLevelEntries.length > 0) {
			const entry = topLevelEntries[0];
			setSelectedStat({
				type: "topLevel",
				key: entry.statKey,
				label: entry.label,
			});
			setXAxisMode("game");
			return;
		}

		for (const group of parsedStatGroups) {
			if (group.values.length > 0) {
				const value = group.values[0];
				setSelectedStat({
					type: "parsed",
					key: value.rawKey,
					label: `${group.baseLabel} (${value.label})`,
				});
				setXAxisMode("game");
				return;
			}
		}

		setSelectedStat({
			type: "topLevel",
			key: "mmr",
			label: formatStatLabel("mmr"),
		});
		setXAxisMode("game");
	}, [player.id, resolvedQueueName, topLevelEntries, parsedStatGroups]);

	const { data: playerStatsData, isLoading: isStatsLoading } =
		useQuery<QueueGameData>({
			queryKey: ["player-games", guildId, player.id, resolvedQueueName],
			queryFn: () => getPlayerStats(guildId, player.id, resolvedQueueName),
			enabled:
				isExpanded &&
				Boolean(guildId) &&
				Boolean(resolvedQueueName) &&
				Boolean(player?.id),
			staleTime: 30000,
		});

	const games = useMemo(() => {
		const rawGames = playerStatsData?.games ?? [];
		return [...rawGames].sort((a, b) => (a.game_num ?? 0) - (b.game_num ?? 0));
	}, [playerStatsData]);

	const seriesData = useMemo<ChartPoint[]>(() => {
		if (!games.length) return [];

		return games
			.map((game, index) => {
				const statValue = getStatValueFromGame(game, selectedStat);
				if (statValue == null) {
					return null;
				}

				const timestampMs = parseTimestampToMs(game.timestamp);
				if (xAxisMode === "date" && timestampMs == null) {
					return null;
				}

				const gameNumber = game.game_num ?? index + 1;
				const xValue =
					xAxisMode === "date" ? (timestampMs as number) : gameNumber;
				const formattedValue = formatNumericValue(statValue, selectedStat.key);
				const timestamp = game.timestamp ?? "";
				const result = game.result ?? "";

				return {
					x: xValue,
					y: statValue,
					custom: {
						gameNumber,
						timestamp,
						result,
						formattedValue,
					},
				} as ChartPoint;
			})
			.filter((point): point is ChartPoint => point !== null);
	}, [games, selectedStat, xAxisMode]);

	const chartOptions = useMemo<Highcharts.Options>(
		() => ({
			chart: {
				backgroundColor: "transparent",
				height: 300,
				style: {
					fontFamily: "Inter, sans-serif",
				},
				zoomType: "x",
				panning: {
					enabled: true,
					type: "x",
				},
				zooming: {
					resetButton: {
						theme: {
							fill: "transparent",
							stroke: "rgb(64, 64, 70)",
							r: 6,
							style: {
								color: "rgb(209, 213, 219)",
								fontSize: "12px",
								fontWeight: "600",
							},
							states: {
								hover: {
									fill: "rgba(64, 64, 70, 0.6)",
									style: {
										color: "rgb(209, 213, 219)",
									},
								},
							},
						},
					},
				},
			},
			title: { text: undefined },
			credits: { enabled: false },
			xAxis: {
				type: xAxisMode === "date" ? "datetime" : "linear",
				title: { text: xAxisMode === "date" ? "Date" : "Game #" },
				labels: { style: { color: "#9ca3af" } },
				gridLineColor: "rgba(255,255,255,0.08)",
				...(xAxisMode === "game" && { allowDecimals: false }),
			},
			yAxis: {
				title: { text: selectedStat.label },
				labels: {
					style: { color: "#9ca3af" },
					formatter: function () {
						return formatNumericValue(this.value as number, selectedStat.key);
					},
				},
				gridLineColor: "rgba(255,255,255,0.08)",
			},
			legend: { enabled: false },
			plotOptions: {
				series: {
					animation: false,
					marker: {
						enabled: true,
						radius: 3,
					},
				},
			},
			series: [
				{
					type: "line",
					name: selectedStat.label,
					data: seriesData,
					color: "#38bdf8",
					lineWidth: 2,
				},
			],
			tooltip: {
				backgroundColor: "rgba(38, 38, 38)",
				borderColor: "rgba(38, 38, 38)",
				opacity: 0.5,
				style: { color: "#f9fafb" },
				formatter(this: Highcharts.Point) {
					const point = this as Highcharts.Point & {
						custom?: ChartPoint["custom"];
					};
					const custom = point.custom;
					const lines: string[] = [];
					const valueLabel =
						custom?.formattedValue ??
						(typeof this.y === "number"
							? formatNumericValue(this.y, selectedStat.key)
							: undefined);
					if (valueLabel !== undefined) {
						lines.push(`${selectedStat.label}: <b>${valueLabel}</b>`);
					}
					if (custom?.gameNumber !== undefined) {
						lines.push(`Game #: ${custom.gameNumber}`);
					}
					if (custom?.timestamp) {
						lines.push(`Date: ${custom.timestamp}`);
					}
					if (custom?.result) {
						lines.push(`Result: ${custom.result} MMR`);
					}
					return lines.join("<br/>") || "";
				},
			},
		}),
		[seriesData, selectedStat, xAxisMode],
	);

	const isDesktop = variant === "desktop";
	const containerClass = isDesktop ? "space-y-6" : "space-y-4";
	const sectionClass = isDesktop ? "space-y-3" : "space-y-3";
	const gridClass = isDesktop
		? "grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-1"
		: "grid grid-cols-2";
	const cardClass = isDesktop
		? "bg-neutral-800 rounded-lg p-2 text-center border border-neutral-700 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
		: "bg-neutral-800 rounded-lg p-1 text-center border border-neutral-700 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500";
	const valueClass = isDesktop
		? "text-xl font-bold text-white"
		: "text-lg font-bold text-white";
	const chartCardClass = isDesktop
		? "bg-neutral-800 border border-neutral-700 rounded-lg p-4"
		: "bg-neutral-800 border border-neutral-700 rounded-lg p-3";

	const hasAnyData =
		topLevelEntries.length > 0 ||
		parsedStatGroups.length > 0 ||
		seriesData.length > 0 ||
		isStatsLoading;

	if (!hasAnyData) {
		return <div className="text-sm text-gray-400 italic">No data found.</div>;
	}

	const handleSelectTopLevel = (entry: StatEntry) => {
		setSelectedStat({
			type: "topLevel",
			key: entry.statKey,
			label: entry.label,
		});
	};

	const handleSelectParsed = (group: GroupedStat, value: GroupedStatValue) => {
		setSelectedStat({
			type: "parsed",
			key: value.rawKey,
			label: `${group.baseLabel} (${value.label})`,
		});
	};

	const renderCard = (entry: StatEntry) => {
		const isActive =
			selectedStat.type === "topLevel" && selectedStat.key === entry.statKey;
		return (
			<button
				type="button"
				key={entry.key}
				onClick={() => handleSelectTopLevel(entry)}
				className={classNames(
					cardClass,
					isActive
						? "border-sky-400 shadow-lg shadow-sky-500/20"
						: "hover:border-neutral-500 hover:bg-neutral-800/60",
				)}
			>
				<div className="text-xs text-gray-400 uppercase tracking-wide">
					{entry.label}
				</div>
				{entry.highlight ? (
					<div
						className="inline-flex items-center px-2 py-1 rounded border font-bold"
						style={{
							borderColor: entry.highlight.border,
							backgroundColor: entry.highlight.bg,
							color: entry.highlight.text,
						}}
					>
						{entry.value}
					</div>
				) : (
					<div className={valueClass}>{entry.value}</div>
				)}
			</button>
		);
	};

	const renderGroupedCard = (group: GroupedStat) => {
		const groupCardClass = isDesktop
			? "bg-neutral-800 rounded-lg p-3 border border-neutral-700"
			: "bg-neutral-800 rounded-lg p-2 border border-neutral-700";
		const groupValueClass = isDesktop
			? "text-lg font-bold text-white"
			: "text-base font-bold text-white";
		const subStatClass = "text-xs text-gray-400";

		return (
			<div key={group.baseName} className={groupCardClass}>
				<div className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
					{group.baseLabel}
				</div>
				<div>
					{group.values.map((value) => {
						const isActive =
							selectedStat.type === "parsed" &&
							selectedStat.key === value.rawKey;
						return (
							<button
								type="button"
								key={value.rawKey}
								onClick={() => handleSelectParsed(group, value)}
								className={classNames(
									"w-full flex justify-between items-baseline rounded-md px-2 py-1 border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500",
									isActive
										? "border-sky-400 bg-sky-500/10 text-white"
										: "border-transparent hover:bg-neutral-700/40 text-gray-300",
								)}
							>
								<span className={subStatClass}>{value.label}:</span>
								<span className={groupValueClass}>{value.value}</span>
							</button>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<div className={containerClass}>
			<div className={sectionClass}>
				<div className={chartCardClass}>
					<div className="flex gap-3 flex-row items-center justify-between">
						<div>
							<div className="text-xs uppercase tracking-wide text-gray-400">
								Performance Graph
							</div>
							<div className="text-lg font-semibold text-white uppercase">
								{selectedStat.label}
							</div>
						</div>
						<div className="flex flex-row items-center gap-2">
							<div className="inline-flex rounded-md border border-neutral-700 overflow-hidden">
								<button
									type="button"
									onClick={() => setXAxisMode("game")}
									className={classNames(
										"px-3 py-1 text-xs font-semibold",
										xAxisMode === "game"
											? "bg-sky-500 text-white"
											: "bg-transparent text-gray-300 hover:bg-neutral-700/60",
									)}
								>
									Per Game
								</button>
								<button
									type="button"
									onClick={() => setXAxisMode("date")}
									className={classNames(
										"px-3 py-1 text-xs font-semibold",
										xAxisMode === "date"
											? "bg-sky-500 text-white"
											: "bg-transparent text-gray-300 hover:bg-neutral-700/60",
									)}
								>
									By Date
								</button>
							</div>
						</div>
					</div>
					<div className={classNames("mt-4")}>
						{isStatsLoading ? (
							<div className="flex h-full items-center justify-center text-sm text-gray-400">
								Loading player history...
							</div>
						) : seriesData.length > 0 ? (
							<HighchartsReact highcharts={Highcharts} options={chartOptions} />
						) : (
							<div className="flex h-full items-center justify-center text-sm text-gray-400">
								No data found.
							</div>
						)}
					</div>
				</div>
			</div>

			{topLevelEntries.length > 0 && (
				<div className={sectionClass}>
					<div className={gridClass}>{topLevelEntries.map(renderCard)}</div>
				</div>
			)}

			{parsedStatGroups.length > 0 && (
				<div className={sectionClass}>
					<div className={gridClass}>
						{parsedStatGroups.map(renderGroupedCard)}
					</div>
				</div>
			)}
		</div>
	);
};

export default ExpandedStats;
