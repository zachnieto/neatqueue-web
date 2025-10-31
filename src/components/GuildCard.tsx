import { useNavigate } from "react-router-dom";
import type { Guild } from "../types";

const GuildCard = ({ guild }: { guild: Guild }) => {
	const navigate = useNavigate();

	return (
		<div className="max-w-sm rounded overflow-hidden shadow-lg bg-black/25 text-white text-center">
			<img
				className="w-1/2 mx-auto pt-5"
				src={
					guild.icon !== null
						? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
						: "https://i.imgur.com/2X6ZRmm.png"
				}
				alt="Server icon"
			/>
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">{guild.name}</div>
				<button
					className="btn-primary"
					onClick={() => navigate(`/manage/${guild.id}`)}
				>
					Manage
				</button>
			</div>
		</div>
	);
};

export default GuildCard;
