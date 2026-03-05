import type { QueuePlayer } from "../../types";

function getPlayerColor(player: QueuePlayer): string {
	const rawColor: unknown = player.color;
	if (rawColor != null) {
		// Discord colors are stored as decimal integers (e.g. 1752220 = #1ABC9C)
		if (typeof rawColor === "number") {
			return `#${rawColor.toString(16).padStart(6, "0")}`;
		}
		if (typeof rawColor === "string" && rawColor.length > 0) {
			return rawColor.startsWith("#") ? rawColor : `#${rawColor}`;
		}
	}
	return "#ffffff";
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
					const color = getPlayerColor(player);
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
							key={`slot-${i}`}
							className="flex items-center gap-2"
							style={{ minWidth: 0 }}
						>
							{player.avatar_url ? (
								<img
									src={player.avatar_url}
									alt=""
									style={{
										width: 18,
										height: 18,
										borderRadius: "50%",
										flexShrink: 0,
										border: `1.5px solid ${color}`,
									}}
								/>
							) : (
								<span
									style={{
										width: 18,
										height: 18,
										borderRadius: "50%",
										background: `${color}22`,
										border: `1.5px solid ${color}`,
										flexShrink: 0,
									}}
								/>
							)}
							<span
								style={{
									fontFamily: "'JetBrains Mono', monospace",
									fontSize: "11px",
									fontWeight: 600,
									color: color,
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
					<div key={`slot-${i}`} className="flex items-center gap-2">
						<span
							style={{
								width: 18,
								height: 18,
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
