import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface MatchCardHeaderProps {
	/** Main title line, e.g. "TEST — Match #173" */
	title: string;
	/** Subtitle line, e.g. a formatted timestamp */
	subtitle?: string;
	/** Server/guild ID for the leaderboard link */
	serverId: string;
	/** Queue channel ID for the leaderboard link */
	channelId: string | number;
	/** Show a pulsing badge */
	status?: string;
	/** Extra badges or content to render after the leaderboard link */
	extra?: ReactNode;
	/** Accent colour for the header background/border — defaults to neutral */
	variant?: "neutral" | "live";
	/** Whether to show the leaderboard link */
	showLeaderboardLink?: boolean;
}

const VARIANT_STYLES: Record<
	NonNullable<MatchCardHeaderProps["variant"]>,
	{ bg: string; border: string }
> = {
	neutral: {
		bg: "rgba(255,255,255,0.02)",
		border: "1px solid rgba(255,255,255,0.06)",
	},
	live: {
		bg: "rgba(255,71,87,0.04)",
		border: "1px solid rgba(255,71,87,0.1)",
	},
};

export default function MatchCardHeader({
	title,
	subtitle,
	serverId,
	channelId,
	status,
	extra,
	variant = "neutral",
	showLeaderboardLink = true,
}: MatchCardHeaderProps) {
	const v = VARIANT_STYLES[variant];

	return (
		<div
			className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
			style={{
				padding: "12px 16px",
				background: v.bg,
				borderBottom: v.border,
			}}
		>
			<div style={{ flex: 1, minWidth: 0 }}>
				<div
					className="font-rajdhani"
					style={{
						fontSize: 14,
						fontWeight: 700,
						color: "#e8eaf0",
						letterSpacing: "0.04em",
					}}
				>
					{title}
				</div>
				{subtitle && (
					<div
						className="section-subtitle"
						style={{ marginTop: 2, fontSize: 11 }}
					>
						{subtitle}
					</div>
				)}
			</div>

			<div className="flex-shrink-0 flex items-center gap-2">
				{showLeaderboardLink && (
					<Link
						to={`/leaderboard/${serverId}/${channelId}`}
						className="btn-action"
						style={{
							padding: "4px 12px",
							fontSize: 11,
							whiteSpace: "nowrap",
						}}
					>
						LEADERBOARD
					</Link>
				)}
				{status && (
					<span
						className="badge-live"
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: 4,
							padding: "3px 8px",
							borderRadius: 2,
							background: "rgba(255,71,87,0.12)",
							border: "1px solid rgba(255,71,87,0.3)",
							fontFamily: "'JetBrains Mono', monospace",
							fontSize: 10,
							fontWeight: 700,
							color: "#ff4757",
							letterSpacing: "0.08em",
						}}
					>
						<span
							style={{
								width: 6,
								height: 6,
								borderRadius: "50%",
								background: "#ff4757",
							}}
							className="uppercase"
						/>
						{status}
					</span>
				)}
				{extra}
			</div>
		</div>
	);
}
