import Panel from "./ui/Panel";

const DataItem = ({ children }: { children: React.ReactNode }) => (
	<div
		style={{
			display: "flex",
			alignItems: "flex-start",
			gap: 10,
			padding: "8px 0",
		}}
	>
		<span
			style={{
				color: "rgba(0,180,255,0.5)",
				fontSize: 8,
				marginTop: 6,
				flexShrink: 0,
			}}
		>
			◆
		</span>
		<span
			style={{
				color: "#9aa0b4",
				fontSize: 14,
				lineHeight: 1.6,
				fontFamily: "'Inter', sans-serif",
			}}
		>
			{children}
		</span>
	</div>
);

const Privacy = () => {
	return (
		<div className="page-wrapper">
			<main className="page-main" style={{ maxWidth: 800 }}>
				{/* Header */}
				<div style={{ marginBottom: 48, textAlign: "center" }}>
					{/* Shield icon */}
					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: 56,
							height: 56,
							borderRadius: "50%",
							background: "rgba(0,180,255,0.08)",
							border: "1px solid rgba(0,180,255,0.2)",
							marginBottom: 20,
						}}
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="rgba(0,180,255,0.7)"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<title>Shield</title>
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
						</svg>
					</div>

					<h1
						className="section-heading accent-underline"
						style={{
							display: "inline-block",
							fontSize: 36,
							marginBottom: 16,
							marginLeft: 20,
						}}
					>
						Privacy Policy
					</h1>

					<p
						className="section-subtitle"
						style={{ textAlign: "center", marginTop: 20 }}
					>
						By using the NeatQueue website and Discord bot, you agree that you
						have read and agree to this policy. This policy is subject to change
						at any time.
					</p>
				</div>

				{/* Information We Collect */}
				<div style={{ marginBottom: 24 }}>
					<Panel accentColor="rgba(0,180,255,0.5)">
						<h2 className="panel-title" style={{ marginBottom: 20 }}>
							Information We Collect
						</h2>
						<div className="divider" style={{ marginBottom: 16 }} />

						<DataItem>Discord usernames</DataItem>
						<DataItem>Discord IDs</DataItem>
						<DataItem>Recent Discord interactions</DataItem>
						<DataItem>
							Match data
							<span
								style={{
									display: "block",
									paddingLeft: 18,
									marginTop: 4,
									fontSize: 13,
								}}
							>
								- Wins / Losses / MMR / Streak
								<br />- Matchups vs other players
							</span>
						</DataItem>
						<DataItem>Server IDs</DataItem>
						<DataItem>Queue channel IDs</DataItem>
						<DataItem>Leaderboard message IDs</DataItem>
						<DataItem>Command usage</DataItem>
						<DataItem>Message content in match channels</DataItem>
					</Panel>
				</div>

				{/* Data Removal */}
				<div style={{ marginBottom: 24 }}>
					<Panel accentColor="rgba(255,71,87,0.5)">
						<h2 className="panel-title" style={{ marginBottom: 20 }}>
							Data Removal
						</h2>
						<div className="divider" style={{ marginBottom: 16 }} />

						<DataItem>
							Server-specific player stats can be deleted via{" "}
							<code>/managestats reset</code>
						</DataItem>
						<DataItem>
							Reach out via the{" "}
							<a
								href="https://discord.gg/neatqueue"
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "#00b4ff",
									textDecoration: "none",
									borderBottom: "1px solid rgba(0,180,255,0.3)",
									transition: "border-color 0.2s",
								}}
							>
								support server
							</a>{" "}
							to request deletion of other data
						</DataItem>
					</Panel>
				</div>
			</main>
		</div>
	);
};

export default Privacy;
