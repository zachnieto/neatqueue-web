import { useHookstate } from "@hookstate/core";
import { useEffect, useState } from "react";
import { getStats } from "../../services/neatqueue-service";
import globalState from "../../state";
import { classNames } from "../../util/tailwind";
import { LoadingBar } from "../Loading";
import CustomParticles from "../Particles";
import Sus from "../Sus";

const Stats = () => {
	const global = useHookstate(globalState);

	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		getStats().finally(() => setLoading(false));
	}, []);

	return (
		<div className="h-screen flex justify-center items-center text-gray-200">
			<div className="">
				<h1 className="md:text-9xl sm:text-8xl text-7xl">NeatQueue</h1>
				<div className="grid grid-cols-4">
					<div className="col-span-1">
						<h1 className="md:text-4xl sm:text-3xl">Servers:</h1>
						<h1 className="md:text-4xl sm:text-3xl">Players:</h1>
						<h1 className="md:text-4xl sm:text-3xl">Matches:</h1>
					</div>
					<div className="col-span-1 flex grid grid-cols-1">
						<h1 className="md:text-4xl sm:text-3xl my-auto">
							{global.stats.servers.get() === -1 ? (
								<LoadingBar />
							) : (
								global.stats.servers.get().toLocaleString()
							)}
						</h1>

						<h1 className="md:text-4xl sm:text-3xl my-auto">
							{global.stats.players.get() === -1 ? (
								<LoadingBar />
							) : (
								global.stats.players.get().toLocaleString()
							)}
						</h1>

						<h1 className="md:text-4xl sm:text-3xl my-auto">
							{global.stats.games.get() === -1 ? (
								<LoadingBar />
							) : (
								global.stats.games.get().toLocaleString()
							)}
						</h1>
					</div>
					<div className="col-span-1" />
					<div className="col-span-1 text-center">
						{!loading && (
							<h1
								className={classNames(
									"text-xl my-auto bg-black/50 md:mx-8 rounded-xl",
									global.stats.servers.get() === -1
										? "text-red-600"
										: "text-green-600",
								)}
							>
								{global.stats.servers.get() === -1 ? "Offline" : "Online"}
							</h1>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Stats;
