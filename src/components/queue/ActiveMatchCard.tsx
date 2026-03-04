import type { ActiveMatch, ChannelRef } from "../../types";
import ChannelMention from "../ChannelMention";
import PlayerList from "./PlayerList";

const DISCORD_CHANNEL_URL = "https://discord.com/channels";

function jumpUrl(serverId: string, channelId: string | number): string {
	return `${DISCORD_CHANNEL_URL}/${serverId}/${channelId}`;
}

function ChannelLink({
	serverId,
	channelRef,
}: {
	serverId: string;
	channelRef: ChannelRef | undefined | null;
}) {
	if (!channelRef || channelRef.id == null) return null;
	const id = String(channelRef.id);
	const name = channelRef.name ?? id;
	return (
		<ChannelMention
			name={name}
			jumpUrl={jumpUrl(serverId, id)}
			type={channelRef.type}
			className="text-[11px]"
		/>
	);
}

type ActiveMatchCardProps = {
	match: ActiveMatch;
	serverId: string;
	gameNumKey?: string;
};

export default function ActiveMatchCard({
	match,
	serverId,
	gameNumKey = "game_num",
}: ActiveMatchCardProps) {
	const gameNum =
		match.game_num ?? (match as Record<string, unknown>)[gameNumKey];
	const teams = match.teams ?? [];
	const hasTeams = teams.some((team) => team.length > 0);
	const stage = match.stage ?? "In progress";
	const channel = match.channel;
	const queue_channel = match.queue_channel;
	const voiceChannels = match.voice_channels ?? [];

	return (
		<div
			className="card-glass rounded-sm"
			style={{
				border: "1px solid rgba(255,255,255,0.07)",
				padding: 0,
				position: "relative",
				display: "flex",
				flexDirection: "column",
				transition: "border-color 0.25s ease, box-shadow 0.25s ease",
			}}
		>
			{/* Top accent bar */}
			<div
				style={{
					height: "2px",
					background:
						"linear-gradient(90deg, rgba(165,94,234,0.6), transparent)",
				}}
			/>

			<div
				style={{
					padding: "20px 22px 22px",
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 12,
				}}
			>
				<div className="flex justify-between items-center gap-3">
					<span
						style={{
							fontFamily: "'Rajdhani', sans-serif",
							fontSize: "18px",
							fontWeight: 700,
							color: "#e8eaf0",
							letterSpacing: "0.04em",
						}}
					>
						Game #{gameNum}
					</span>
					<span
						style={{
							padding: "4px 10px",
							borderRadius: 2,
							background: "rgba(57,217,138,0.12)",
							border: "1px solid rgba(57,217,138,0.35)",
							fontFamily: "'JetBrains Mono', monospace",
							fontSize: "9px",
							fontWeight: 700,
							color: "#39d98a",
							letterSpacing: "0.1em",
						}}
					>
						{stage.toUpperCase()}
					</span>
				</div>

				{(hasTeams || (match.players?.length ?? 0) > 0) && (
					<>
						<div
							style={{ height: "1px", background: "rgba(255,255,255,0.05)" }}
						/>
						{hasTeams ? (
							<div className="grid grid-cols-2 gap-3">
								{teams
									.filter((team) => team.length > 0)
									.map((team, teamIdx) => (
										<div
											key={`game-${gameNum}-team-${team.map((p) => p.id).join("-")}`}
											style={{
												fontFamily: "'Inter', sans-serif",
												fontSize: "11px",
											}}
										>
											<p
												style={{
													color: "#5a6078",
													letterSpacing: "0.05em",
													textTransform: "uppercase",
													marginBottom: 6,
												}}
											>
												Team {teamIdx + 1}
											</p>
											<PlayerList players={team} />
										</div>
									))}
							</div>
						) : (
							<div
								style={{
									fontFamily: "'Inter', sans-serif",
									fontSize: "11px",
								}}
							>
								<p
									style={{
										color: "#5a6078",
										letterSpacing: "0.05em",
										textTransform: "uppercase",
										marginBottom: 6,
									}}
								>
									Players
								</p>
								<PlayerList players={match.players ?? []} />
							</div>
						)}
					</>
				)}

				<div className="flex flex-wrap gap-2 items-center mt-1">
					{channel && <ChannelLink serverId={serverId} channelRef={channel} />}
					{queue_channel &&
						String(queue_channel.id) !== String(channel?.id) && (
							<ChannelLink serverId={serverId} channelRef={queue_channel} />
						)}
					{voiceChannels
						.filter((vc): vc is ChannelRef => vc != null && vc.id != null)
						.map((vc) => (
							<ChannelLink
								key={String(vc.id)}
								serverId={serverId}
								channelRef={vc}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
