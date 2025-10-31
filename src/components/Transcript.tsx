import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getTranscript } from "../services/neatqueue-service";
import Loading from "./Loading";

const Transcript = () => {
	const { guildID, gameNum } = useParams();
	const [html, setHtml] = useState<string>("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!guildID || !gameNum) return;
		getTranscript(guildID, gameNum).then((html) => {
			setHtml(html);
			setLoading(false);
		});
	}, []);

	if (loading) return <Loading />;

	return (
		<div className="h-100vh">
			<iframe
				srcDoc={html}
				style={{ width: "1px", minWidth: "100%", height: "90vh" }}
			/>
		</div>
	);
};

export default Transcript;
