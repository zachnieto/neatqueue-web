import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import WsStatusIndicator from "../components/queue/WsStatusIndicator";
import ServerCard from "../components/ServerCard";
import PageLayout from "../components/ui/PageLayout";
import SectionHeader from "../components/ui/SectionHeader";
import { getUserServers } from "../services/neatqueue-service";

export default function ServersPage() {
	const {
		data: servers,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user-servers"],
		queryFn: getUserServers,
	});
	const navigate = useNavigate();

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p className="text-red-400">
					Failed to load servers. Please try again.
				</p>
			</div>
		);
	}

	return (
		<PageLayout>
			<SectionHeader
				title="Your Servers"
				subtitle="Select a server to view its queues."
				trailing={<WsStatusIndicator />}
			/>
			<div
				className="grid gap-4"
				style={{
					gridTemplateColumns:
						"repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
				}}
			>
				{isLoading
					? Array.from({ length: 12 }, (_, i) => (
							<ServerCard.Skeleton key={`skeleton-${i}`} />
						))
					: (servers ?? []).map((server) => (
							<ServerCard
								key={server.id}
								id={server.id}
								name={server.name}
								icon={server.icon}
								memberCount={server.member_count}
								actions={[
									{
										text: "View Queues",
										onClick: () => navigate(`/servers/${server.id}`),
									},
								]}
							/>
						))}
			</div>
			{!isLoading && (!servers || servers.length === 0) && (
				<p className="section-subtitle mt-8">
					You are not in any servers that use NeatQueue. Join a server with the
					bot to see queues here.
				</p>
			)}
		</PageLayout>
	);
}
