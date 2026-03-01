import { useHookstate } from "@hookstate/core";
import globalState, { sessionReadyState } from "../state";
import GuildCard from "./GuildCard";

const Dashboard = () => {
	const state = useHookstate(globalState);
	const ready = useHookstate(sessionReadyState);
	const { guilds } = state.get();
	const loading = !ready.get() || guilds === undefined;

	return (
		<div className="min-h-screen">
			<div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3">
				{loading
					? Array.from({ length: 20 }, (_, i) => `skeleton-${i}`).map((id) => (
							<GuildCard.Skeleton key={id} />
						))
					: guilds.map((guild) => <GuildCard key={guild.id} guild={guild} />)}
			</div>
		</div>
	);
};

export default Dashboard;
