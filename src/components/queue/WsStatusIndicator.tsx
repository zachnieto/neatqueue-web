import { useWsConnectionStatus } from "../../hooks/useWsConnectionStatus";

export default function WsStatusIndicator() {
	const { connected } = useWsConnectionStatus();

	if (connected) return null;

	return (
		<div
			className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded"
			style={{
				background: "rgba(122, 128, 153, 0.12)",
				border: "1px solid rgba(255, 71, 87, 0.2)",
			}}
			title="Disconnected"
		>
			<span
				className="inline-block w-1.5 h-1.5 rounded-full shrink-0 opacity-60"
				style={{
					background: "#7a8099",
				}}
				aria-hidden
			/>
			<span
				style={{
					fontFamily: "'JetBrains Mono', monospace",
					fontSize: "10px",
					fontWeight: 600,
					color: "#7a8099",
					letterSpacing: "0.08em",
				}}
			>
				DISCONNECTED
			</span>
		</div>
	);
}
