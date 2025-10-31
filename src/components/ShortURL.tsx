import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getLongUrl } from "../services/neatqueue-service";
import Leaderboard from "./Leaderboard";

const ShortURL = () => {
	const { shortUrl } = useParams();
	const navigate = useNavigate();

	const [guildId, setGuildId] = useState<string>("");
	const [channelId, setChannelId] = useState<string>("");

	const commonMaps = {
		ProCity: "/leaderboard/1061301529597976700/1061303977460908173",
	};

	const updateFromString = (str: string) => {
		const args = str.split("/");
		setGuildId(args[2]);
		setChannelId(args[3]);
	};

	useEffect(() => {
		if (!shortUrl) return;

		if (shortUrl in commonMaps) {
			updateFromString(commonMaps[shortUrl as keyof typeof commonMaps]);
		} else {
			getLongUrl(shortUrl).then((res) => {
				if (res !== null) {
					updateFromString(res);
				}
			});
		}
	}, [shortUrl]);

	if (!shortUrl || !guildId || !channelId) return <></>;

	return (
		<>
			<Leaderboard passedGuildId={guildId} passedChannelId={channelId} />
		</>
	);
};

export default ShortURL;
