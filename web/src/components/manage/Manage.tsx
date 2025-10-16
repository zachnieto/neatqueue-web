import { useHookstate } from "@hookstate/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPremium } from "../../services/neatqueue-service";
import globalState from "../../state";
import type { Guild, PremiumData } from "../../types";
import Alert from "../Alert";
import Credits from "./Credits";
import Instance from "./instance/Instance";
import PremiumStatus from "./PremiumStatus";

const Manage = () => {
	const { guildID } = useParams();
	const state = useHookstate(globalState);
	const [guild, setGuild] = useState<Guild>();
	const [premiumData, setPremiumData] = useState<PremiumData>();

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

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

	return (
		<div className="min-h-screen">
			<div className="text-center mb-5">
				<h1 className="text-5xl">{guild.name}</h1>
				<Alert value={success} setValue={setSuccess} color="bg-green-600" />
				<Alert value={error} setValue={setError} color="bg-red-600" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:mx-32 gap-8">
				{premiumData && guildID && (
					<>
						<PremiumStatus
							premiumData={premiumData}
							setPremiumData={setPremiumData}
							guildID={guildID}
							setError={setError}
							setSuccess={setSuccess}
						/>
						<Credits
							premiumData={premiumData}
							refreshPremiumData={refreshPremiumData}
							guildID={guildID}
							setError={setError}
							setSuccess={setSuccess}
						/>
						<Instance
						guildID={guildID}
						setError={setError}
						setSuccess={setSuccess}
						refreshPremiumData={refreshPremiumData}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default Manage;
