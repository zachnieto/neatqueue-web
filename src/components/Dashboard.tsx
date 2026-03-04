import { useHookstate } from "@hookstate/core";
import globalState, { sessionReadyState } from "../state";
import GuildCard from "./GuildCard";
import PageLayout from "./ui/PageLayout";
import SectionHeader from "./ui/SectionHeader";

const Dashboard = () => {
	const state = useHookstate(globalState);
	const ready = useHookstate(sessionReadyState);
	const { guilds } = state.get();
	const loading = !ready.get() || guilds === undefined;

	return (
		<PageLayout>
			<SectionHeader
				title="Manage Servers"
				subtitle="Select a server to configure queues and settings."
			/>
			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns:
						"repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
				}}
			>
				{loading
					? Array.from({ length: 20 }, (_, i) => `skeleton-${i}`).map((id) => (
							<GuildCard.Skeleton key={id} />
						))
					: guilds.map((guild) => <GuildCard key={guild.id} guild={guild} />)}
			</div>
		</PageLayout>
	);
};

export default Dashboard;
