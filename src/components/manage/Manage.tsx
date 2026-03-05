import { useHookstate } from "@hookstate/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { getPremium } from "../../services/neatqueue-service";
import globalState from "../../state";
import type { Guild } from "../../types";
import ServerPageLayout from "../ui/ServerPageLayout";
import Credits from "./Credits";
import Instance from "./instance/Instance";
import PremiumStatus from "./PremiumStatus";

const SkeletonCard = () => (
	<div
		className="animate-pulse"
		style={{
			background: "rgba(255,255,255,0.03)",
			border: "1px solid rgba(255,255,255,0.06)",
			borderRadius: 4,
			padding: 24,
			minHeight: 180,
		}}
	>
		<div
			style={{
				height: 16,
				width: "40%",
				background: "rgba(255,255,255,0.08)",
				borderRadius: 4,
				marginBottom: 16,
			}}
		/>
		<div
			style={{
				height: 12,
				width: "70%",
				background: "rgba(255,255,255,0.06)",
				borderRadius: 4,
				marginBottom: 12,
			}}
		/>
		<div
			style={{
				height: 12,
				width: "55%",
				background: "rgba(255,255,255,0.05)",
				borderRadius: 4,
				marginBottom: 24,
			}}
		/>
		<div
			style={{
				height: 32,
				width: "100%",
				background: "rgba(255,255,255,0.04)",
				borderRadius: 4,
			}}
		/>
	</div>
);

const Manage = () => {
	const { guildID } = useParams();
	const state = useHookstate(globalState);
	const queryClient = useQueryClient();
	const { showToast } = useToast();
	const [guild, setGuild] = useState<Guild>();

	const { data: premiumData, isLoading } = useQuery({
		queryKey: ["premium", guildID],
		queryFn: () => getPremium(guildID!),
		enabled: !!guildID,
	});

	const refreshPremiumData = useCallback(async () => {
		await queryClient.invalidateQueries({ queryKey: ["premium", guildID] });
	}, [queryClient, guildID]);

	useEffect(() => {
		if (guildID) {
			setGuild(state.guilds.get()?.find((g) => g.id === guildID));
		}
	}, [state.guilds, guildID]);

	if (!guild) {
		return null;
	}

	const guildIconUrl = guild.icon
		? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
		: null;

	const showError = (message: string) => {
		showToast("Error", { message, variant: "error" });
	};

	const showSuccess = (message: string) => {
		showToast("Success", { message, variant: "success" });
	};

	if (isLoading) {
		return (
			<ServerPageLayout
				serverName={guild.name}
				serverIconUrl={guildIconUrl}
				memberCount={guild.approximate_member_count}
				serverHeaderLoading
				sectionTitle="Manage"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
					<SkeletonCard />
					<SkeletonCard />
					<SkeletonCard />
				</div>
			</ServerPageLayout>
		);
	}

	if (!premiumData?.occupied) {
		return (
			<ServerPageLayout
				serverName={guild.name}
				serverIconUrl={guildIconUrl}
				memberCount={guild.approximate_member_count}
				sectionTitle="Settings"
			>
				<p className="section-subtitle">
					Please invite the bot to your server to get started.
				</p>
			</ServerPageLayout>
		);
	}

	return (
		<ServerPageLayout
			serverName={guild.name}
			serverIconUrl={guildIconUrl}
			memberCount={guild.approximate_member_count}
			sectionTitle="Manage"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
				{premiumData && guildID && (
					<>
						<PremiumStatus
							premiumData={premiumData}
							refreshPremiumData={refreshPremiumData}
							guildID={guildID}
							setError={showError}
							setSuccess={showSuccess}
						/>
						<Credits
							premiumData={premiumData}
							refreshPremiumData={refreshPremiumData}
							guildID={guildID}
							setError={showError}
							setSuccess={showSuccess}
						/>
						<Instance
							guildID={guildID}
							setError={showError}
							setSuccess={showSuccess}
							refreshPremiumData={refreshPremiumData}
						/>
					</>
				)}
			</div>
		</ServerPageLayout>
	);
};

export default Manage;
