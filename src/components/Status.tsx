import { useEffect, useState } from "react";
import { getStatus } from "../services/neatqueue-service";
import type { NodeStatus } from "../types";

const Status = () => {
	const [statuses, setStatuses] = useState<NodeStatus[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [overallStatus, setOverallStatus] = useState<string>("HEALTHY");
	const [overallStatusColor, setOverallStatusColor] =
		useState<string>("text-yellow-400");

	useEffect(() => {
		getStatus()
			.then(setStatuses)
			.catch(() => setStatuses([]))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		const healthies = statuses.filter((s) => s.status === "ONLINE").length;

		if (healthies === statuses.length) {
			setOverallStatus("Healthy");
			setOverallStatusColor("text-green-400");
		} else if (healthies === 0) {
			setOverallStatus("Offline");
			setOverallStatusColor("text-red-400");
		} else {
			setOverallStatus("Degraded");
			setOverallStatusColor("text-yellow-400");
		}
	}, [statuses]);

	return (
		<div className="min-h-screen flex justify-center items-center p-4">
			{!loading && (
				<div className="flex flex-col items-center gap-4 w-full max-w-6xl">
					<h1 className="w-fit text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center bg-black/75 p-3 sm:p-4 md:p-6 rounded-xl">
						Status: <span className={overallStatusColor}>{overallStatus}</span>
					</h1>

					<div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 w-full">
						{statuses.map((status) => (
							<div
								key={status.id}
								className="text-center bg-black/75 p-3 sm:p-4 md:p-6 rounded-xl min-w-[200px] sm:min-w-[250px]"
							>
								<h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2">
									Node {status.id}
								</h1>
								<h1
									className={`text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 ${
										status.status === "ONLINE"
											? "text-green-400"
											: "text-red-400"
									}`}
								>
									{status.status}
								</h1>
								<h1 className="text-sm sm:text-base md:text-lg lg:text-xl">
									Shards: {status.shards}
								</h1>
								<h1 className="text-sm sm:text-base md:text-lg lg:text-xl">
									Servers: {status.guilds.toLocaleString()}
								</h1>
								<h1 className="text-sm sm:text-base md:text-lg lg:text-xl">
									Users: {status.member_count.toLocaleString()}
								</h1>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default Status;
