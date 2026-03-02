import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { getLongUrl } from "../services/neatqueue-service";
import Leaderboard from "./Leaderboard";

const commonMaps: Record<string, string> = {
	ProCity: "/leaderboard/1061301529597976700/1061303977460908173",
};

const ShortURL = () => {
	const { shortUrl } = useParams();

	const [guildId, setGuildId] = useState<string>("");
	const [channelId, setChannelId] = useState<string>("");

	const updateFromString = useCallback((str: string) => {
		const args = str.split("/");
		setGuildId(args[2]);
		setChannelId(args[3]);
	}, []);

	useEffect(() => {
		if (!shortUrl) return;

		if (shortUrl in commonMaps) {
			updateFromString(commonMaps[shortUrl]);
		} else {
			getLongUrl(shortUrl).then((res) => {
				if (res !== null) {
					updateFromString(res);
				}
			});
		}
	}, [shortUrl, updateFromString]);

	if (!shortUrl || !guildId || !channelId) return null;

	return <Leaderboard passedGuildId={guildId} passedChannelId={channelId} />;
};

export default ShortURL;
