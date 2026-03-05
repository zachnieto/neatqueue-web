import { useState } from "react";

type ServerCardAction = {
	text: string;
	onClick: () => void;
};

type ServerCardProps = {
	id: string;
	name: string;
	icon?: string | null;
	memberCount?: number | null;
	actions: ServerCardAction[];
};

export default function ServerCard({
	id,
	name,
	icon,
	memberCount,
	actions,
}: ServerCardProps) {
	const [hovered, setHovered] = useState(false);

	const iconUrl = icon
		? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
		: "https://i.imgur.com/2X6ZRmm.png";

	return (
		<section
			aria-label={`Server: ${name}`}
			className="card-glass rounded-sm"
			style={{
				border: "1px solid rgba(255,255,255,0.07)",
				padding: 0,
				position: "relative",
				display: "flex",
				flexDirection: "column",
			}}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<div
				style={{
					height: "2px",
					background: hovered
						? "linear-gradient(90deg, rgba(0,180,255,0.5), transparent)"
						: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)",
					transition: "background 0.3s ease",
				}}
			/>

			<div
				style={{
					padding: "20px 22px 22px",
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 16,
				}}
			>
				<div className="flex items-center gap-4">
					<img
						src={iconUrl}
						alt="Server icon"
						className="w-12 h-12 rounded-full flex-shrink-0"
						style={{ border: "1px solid rgba(255,255,255,0.1)" }}
					/>
					<div style={{ flex: 1, minWidth: 0 }}>
						<div
							className="font-rajdhani"
							style={{
								fontSize: "18px",
								fontWeight: 700,
								color: "#e8eaf0",
								letterSpacing: "0.04em",
								lineHeight: 1.2,
								whiteSpace: "nowrap",
								overflow: "hidden",
								textOverflow: "ellipsis",
							}}
						>
							{name}
						</div>
						{memberCount != null && (
							<div className="section-subtitle" style={{ marginTop: 3 }}>
								{memberCount} members
							</div>
						)}
					</div>
				</div>

				<div
					style={{
						marginTop: "auto",
						display: "flex",
						flexDirection: "column",
						gap: 8,
					}}
				>
					{actions.map((action) => (
						<button
							key={action.text}
							type="button"
							className="btn-action btn-join w-full"
							onClick={action.onClick}
						>
							{action.text}
						</button>
					))}
				</div>
			</div>
		</section>
	);
}

ServerCard.Skeleton = function ServerCardSkeleton() {
	return (
		<div
			className="card-glass rounded-sm"
			style={{
				border: "1px solid rgba(255,255,255,0.07)",
				padding: 0,
				position: "relative",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					height: "2px",
					background: "rgba(255,255,255,0.06)",
				}}
			/>
			<div
				style={{
					padding: "20px 22px 22px",
					flex: 1,
					display: "flex",
					flexDirection: "column",
					gap: 16,
				}}
			>
				<div className="flex items-center gap-4">
					<div className="w-12 h-12 rounded-full flex-shrink-0 bg-white/5 animate-pulse" />
					<div style={{ flex: 1, minWidth: 0 }}>
						<div className="h-5 bg-white/10 rounded w-3/4 mb-2 animate-pulse" />
						<div className="h-3 bg-white/5 rounded w-1/2 animate-pulse" />
					</div>
				</div>
				<div style={{ marginTop: "auto" }}>
					<div className="w-full h-[38px] rounded bg-white/5 animate-pulse" />
				</div>
			</div>
		</div>
	);
};
