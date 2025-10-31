import { useHookstate } from "@hookstate/core";
import globalState from "../state";
import GuildCard from "./GuildCard";

const Dashboard = () => {
	const state = useHookstate(globalState);
	const { guilds } = state.get();

	return (
		<div className="min-h-screen">
			<div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3">
				{guilds &&
					guilds.map((guild) => <GuildCard key={guild.id} guild={guild} />)}
			</div>
		</div>
	);
};

export default Dashboard;
