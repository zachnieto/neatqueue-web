import { useHookstate } from "@hookstate/core";
import { useNavigate } from "react-router-dom";
import ServerCard from "../components/ServerCard";
import PageLayout from "../components/ui/PageLayout";
import SectionHeader from "../components/ui/SectionHeader";
import globalState, { sessionReadyState } from "../state";

const MANAGE_CHANNELS = 0x10;

export default function ServersPage() {
	const state = useHookstate(globalState);
	const ready = useHookstate(sessionReadyState);
	const navigate = useNavigate();
	const { guilds } = state.get();
	const loading = !ready.get() || guilds === undefined;

	return (
		<PageLayout>
			<SectionHeader
				title="Your Servers"
				subtitle="Select a server to view queues or manage settings."
			/>
			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns:
						"repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
				}}
			>
				{loading
					? Array.from({ length: 12 }, (_, i) => (
							<ServerCard.Skeleton key={`skeleton-${i}`} />
						))
					: guilds.map((guild) => {
							const canManage =
								(guild.permissions & MANAGE_CHANNELS) === MANAGE_CHANNELS;
							const actions = [
								{
									text: "Queues",
									onClick: () => navigate(`/servers/${guild.id}`),
								},
							];
							if (canManage) {
								actions.push({
									text: "Manage",
									onClick: () => navigate(`/manage/${guild.id}`),
								});
							}
							actions.push({
								text: "History",
								onClick: () => navigate(`/history/${guild.id}`),
							});
							return (
								<ServerCard
									key={guild.id}
									id={guild.id}
									name={guild.name}
									icon={guild.icon}
									memberCount={guild.approximate_member_count}
									actions={actions}
								/>
							);
						})}
			</div>
			{!loading && (!guilds || guilds.length === 0) && (
				<p className="section-subtitle mt-8">
					You are not in any servers. Join a server with NeatQueue to see it
					here.
				</p>
			)}
		</PageLayout>
	);
}
