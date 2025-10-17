import { useHookstate } from "@hookstate/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { getPremium } from "../../services/neatqueue-service";
import globalState from "../../state";
import type { Guild, PremiumData } from "../../types";
import Credits from "./Credits";
import Instance from "./instance/Instance";
import PremiumStatus from "./PremiumStatus";

const Manage = () => {
	const { guildID } = useParams();
	const state = useHookstate(globalState);
	const { showToast } = useToast();
	const [guild, setGuild] = useState<Guild>();
	const [premiumData, setPremiumData] = useState<PremiumData>();

	useEffect(() => {
		if (guildID) {
			setGuild(state.guilds.get()?.find((g) => g.id == guildID));
			refreshPremiumData();
		}
	}, [state.guilds, guildID]);

	const refreshPremiumData = async () => {
		if (guildID) getPremium(guildID, state.auth.get()).then(setPremiumData);
	};

	if (!guild) {
		return <></>;
	}

	const showError = (message: string) => {
		showToast("Error", { message, variant: "error" });
	};

	const showSuccess = (message: string) => {
		showToast("Success", { message, variant: "success" });
	};

	return (
		<div className="min-h-screen">
			<div className="text-center mb-5">
				<h1 className="text-5xl">{guild.name}</h1>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:mx-32 gap-8">
				{premiumData && guildID && (
					<>
						<PremiumStatus
							premiumData={premiumData}
							setPremiumData={setPremiumData}
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
		</div>
	);
};

export default Manage;
