import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import WsStatusIndicator from "../components/queue/WsStatusIndicator";
import { getUserServers } from "../services/neatqueue-service";
import type { UserServer } from "../types";

function ServerCard({ server }: { server: UserServer }) {
	const navigate = useNavigate();
	return (
		<div className="max-w-sm rounded overflow-hidden shadow-lg bg-black/25 text-white text-center">
			<img
				className="w-1/2 mx-auto pt-5"
				src={
					server.icon
						? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
						: "https://i.imgur.com/2X6ZRmm.png"
				}
				alt="Server icon"
			/>
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">{server.name}</div>
				{server.member_count != null && (
					<p className="text-sm text-gray-300 mb-2">
						{server.member_count} members
					</p>
				)}
				<button
					type="button"
					className="btn-primary"
					onClick={() => navigate(`/servers/${server.id}`)}
				>
					View Queues
				</button>
			</div>
		</div>
	);
}

function ServerCardSkeleton() {
	return (
		<div className="max-w-sm rounded overflow-hidden shadow-lg bg-black/25 text-white text-center">
			<Skeleton className="w-1/2 h-24 mx-auto mt-5" />
			<div className="px-6 py-4 space-y-3">
				<Skeleton className="h-6 w-3/4 mx-auto" />
				<Skeleton className="h-4 w-1/2 mx-auto" />
				<Skeleton className="h-10 w-full" />
			</div>
		</div>
	);
}

export default function ServersPage() {
	const {
		data: servers,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["user-servers"],
		queryFn: getUserServers,
	});

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
		<div className="min-h-screen">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-white">Your Servers</h1>
				<WsStatusIndicator />
			</div>
			<div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3">
				{isLoading
					? Array.from({ length: 12 }, (_, i) => (
							<ServerCardSkeleton key={`skeleton-${i}`} />
						))
					: (servers ?? []).map((server) => (
							<ServerCard key={server.id} server={server} />
						))}
			</div>
			{!isLoading && (!servers || servers.length === 0) && (
				<p className="text-gray-400 mt-8">
					You are not in any servers that use NeatQueue. Join a server with the
					bot to see queues here.
				</p>
			)}
		</div>
	);
}
