import { useHookstate } from "@hookstate/core";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { getPremium } from "../../services/neatqueue-service";
import globalState from "../../state";
import type { Guild, PremiumData } from "../../types";
import PageLayout from "../ui/PageLayout";
import SectionHeader from "../ui/SectionHeader";
import Credits from "./Credits";
import Instance from "./instance/Instance";
import PremiumStatus from "./PremiumStatus";

const Manage = () => {
	const { guildID } = useParams();
	const state = useHookstate(globalState);
	const { showToast } = useToast();
	const [guild, setGuild] = useState<Guild>();
	const [premiumData, setPremiumData] = useState<PremiumData>();

	const refreshPremiumData = useCallback(async () => {
		if (guildID) getPremium(guildID).then(setPremiumData);
	}, [guildID]);

	useEffect(() => {
		if (guildID) {
			setGuild(state.guilds.get()?.find((g) => g.id === guildID));
			refreshPremiumData();
		}
	}, [state.guilds, guildID, refreshPremiumData]);

	if (!guild) {
		return null;
	}

	const showError = (message: string) => {
		showToast("Error", { message, variant: "error" });
	};

	const showSuccess = (message: string) => {
		showToast("Success", { message, variant: "success" });
	};

	if (!premiumData?.occupied) {
		return (
			<PageLayout>
				<SectionHeader title={guild.name} />
				<p className="section-subtitle">
					Please invite the bot to your server to get started.
				</p>
			</PageLayout>
		);
	}

	return (
		<PageLayout>
			<SectionHeader
				title={`${guild.name} Settings`}
				subtitle="Manage premium, credits, and instance configuration."
			/>

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
		</PageLayout>
	);
};

export default Manage;
