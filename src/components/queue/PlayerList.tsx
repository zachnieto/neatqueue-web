import type { QueuePlayer } from "../../types";

const PLAYER_COLORS = [
	"#00b4ff",
	"#a55eea",
	"#39d98a",
	"#ff6b35",
	"#ffa502",
	"#ff4757",
	"#7a8099",
];

function getPlayerColor(index: number): string {
	return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

export default function PlayerList({
	players,
	hideNames,
	maxPlayers,
}: {
	players: QueuePlayer[];
	hideNames?: boolean;
	maxPlayers?: number;
}) {
	const slots: (QueuePlayer | null)[] = maxPlayers
		? Array.from({ length: maxPlayers }, (_, i) => players[i] ?? null)
		: players.map((p) => p);

	return (
		<div className="flex flex-col gap-1.5">
			{slots.map((player, i) => {
				if (player) {
					const color = getPlayerColor(i);
					const displayName = hideNames
						? `Player ${i + 1}`
						: [
								player.name,
								player.role ? `(${player.role})` : "",
								player.mmr != null ? `— ${player.mmr.toFixed(0)} MMR` : "",
							]
								.filter(Boolean)
								.join(" ");
					return (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: slots are positional; a player can appear multiple times
							key={`slot-${i}`}
							className="flex items-center gap-2"
							style={{ minWidth: 0 }}
						>
							<span
								style={{
									width: 7,
									height: 7,
									borderRadius: "50%",
									background: color,
									flexShrink: 0,
									boxShadow: `0 0 6px ${color}88`,
								}}
							/>
							<span
								style={{
									fontFamily: "'JetBrains Mono', monospace",
									fontSize: "11px",
									fontWeight: 600,
									color: "#c8cad8",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
								}}
							>
								{displayName}
							</span>
						</div>
					);
				}
				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: slots are positional
						key={`slot-${i}`}
						className="flex items-center gap-2"
					>
						<span
							style={{
								width: 7,
								height: 7,
								borderRadius: "50%",
								border: "1.5px dashed rgba(255,255,255,0.15)",
								flexShrink: 0,
							}}
						/>
						<span
							style={{
								fontFamily: "'JetBrains Mono', monospace",
								fontSize: "11px",
								color: "#3d4258",
							}}
						>
							Waiting...
						</span>
					</div>
				);
			})}
		</div>
	);
}
