import { useHookstate } from "@hookstate/core";
import { useNavigate } from "react-router-dom";
import globalState, { sessionReadyState } from "../state";
import ServerCard from "./ServerCard";
import PageLayout from "./ui/PageLayout";
import SectionHeader from "./ui/SectionHeader";

const Dashboard = () => {
	const state = useHookstate(globalState);
	const ready = useHookstate(sessionReadyState);
	const navigate = useNavigate();
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
							<ServerCard.Skeleton key={id} />
						))
					: guilds.map((guild) => (
							<ServerCard
								key={guild.id}
								id={guild.id}
								name={guild.name}
								icon={guild.icon}
								actions={[
									{
										text: "Manage",
										onClick: () => navigate(`/manage/${guild.id}`),
									},
								]}
							/>
						))}
			</div>
		</PageLayout>
	);
};

export default Dashboard;
