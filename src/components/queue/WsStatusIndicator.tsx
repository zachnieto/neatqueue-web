import { useEffect } from "react";
import { getWsSocket } from "../../services/ws-service";
import { useWsConnectionStatus } from "../../hooks/useWsConnectionStatus";

export default function WsStatusIndicator() {
	const { connected, lastError } = useWsConnectionStatus();

	useEffect(() => {
		getWsSocket().ensureConnected();
	}, []);

	const title = connected
		? "Realtime updates connected"
		: lastError
			? `Disconnected: ${lastError}`
			: "Realtime updates disconnected";

	return (
		<div
			className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded"
			style={{
				background: connected
					? "rgba(57, 217, 138, 0.08)"
					: "rgba(122, 128, 153, 0.12)",
				border: connected
					? "1px solid rgba(57, 217, 138, 0.2)"
					: "1px solid rgba(255, 71, 87, 0.2)",
			}}
			title={title}
		>
			<span
				className={`status-online-dot inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
					connected ? "" : "opacity-60"
				}`}
				style={{
					background: connected ? "#39d98a" : "#7a8099",
				}}
				aria-hidden
			/>
			<span
				style={{
					fontFamily: "'JetBrains Mono', monospace",
					fontSize: "10px",
					fontWeight: 600,
					color: connected ? "#39d98a" : "#7a8099",
					letterSpacing: "0.08em",
				}}
			>
				{connected ? "LIVE" : "DISCONNECTED"}
			</span>
			{!connected && lastError && (
				<span
					className="max-w-[12rem] truncate"
					style={{
						fontFamily: "'JetBrains Mono', monospace",
						fontSize: "9px",
						color: "#ffa502",
					}}
					title={lastError}
				>
					{lastError}
				</span>
			)}
		</div>
	);
}
