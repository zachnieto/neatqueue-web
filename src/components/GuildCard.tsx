import { useNavigate } from "react-router-dom";
import type { Guild } from "../types";
import ServerCard from "./ServerCard";

const GuildCard = ({ guild }: { guild: Guild }) => {
	const navigate = useNavigate();

	return (
		<ServerCard
			id={guild.id}
			name={guild.name}
			icon={guild.icon}
			actionText="Manage"
			onClick={() => navigate(`/manage/${guild.id}`)}
		/>
	);
};

GuildCard.Skeleton = ServerCard.Skeleton;

export default GuildCard;
