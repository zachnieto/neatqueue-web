import { classNames } from "../util/tailwind";
import { displayPercent } from "../util/utility";

const LeaderboardItem = ({
	player,
	rank,
	sortKey,
}: {
	player: any;
	rank: number;
	sortKey: string;
}) => {
	let arrowClass = "";
	if (sortKey === "mmr" && player.data.rank !== rank) {
		arrowClass =
			"w-2 h-2 border-t-2 border-l-2 md:w-4 md:h-4 md:border-t-4 md:border-l-4 border-solid ";

		arrowClass +=
			player.data.rank > rank
				? `rotate-45 border-t-green-400 border-l-green-400 translate-y-0.5`
				: `-rotate-[135deg] border-t-red-700 border-l-red-700 -translate-y-1`;
	}

	let borderColorClass = "";
	if (rank === 1) {
		borderColorClass = "border-amber-500 md:border-8 border-4";
	} else if (rank === 2) {
		borderColorClass = "border-gray-500 md:border-8 border-4";
	} else if (rank === 3) {
		borderColorClass = "border-orange-800 md:border-8 border-4";
	} else {
		borderColorClass = "border-transparent md:border-8 border-4";
	}

	return (
		<div
			className={classNames(
				borderColorClass,
				"bg-violet-900/80 border-orange rounded text-white md:py-2 sm:py-1 font-medium shadow-xl flex flex-row xl:text-5xl lg:text-3xl md:text-xl my-1",
			)}
		>
			<div className="my-auto md:mx-3 mx-2 basis-5">
				<div className={arrowClass} />
			</div>

			<div className={sortKey === "mmr" ? "basis-2/4" : "basis-3/4"}>
				<h1 className="md:text-3xl sm:text-lg">
					{rank}. {player.name}
				</h1>
			</div>

			{sortKey === "mmr" ? (
				<>
					<div className="basis-1/4">
						<h1 className="md:text-3xl sm:text-lg">
							{parseInt(player.data[sortKey])}
						</h1>
					</div>
					<div className="basis-1/4">
						<h1 className="md:text-3xl sm:text-lg">
							({player.data.wins} - {player.data.losses})
						</h1>
					</div>
				</>
			) : (
				<div className="basis-1/4">
					<h1 className="md:text-3xl sm:text-lg">
						{sortKey !== "winrate"
							? parseInt(player.data[sortKey])
							: displayPercent(player.data[sortKey])}
					</h1>
				</div>
			)}
		</div>
	);
};

export default LeaderboardItem;
