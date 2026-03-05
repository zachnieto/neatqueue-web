type ServerHeaderProps = {
	name?: string;
	iconUrl?: string | null;
	memberCount?: number | null;
	isLoading?: boolean;
};

export default function ServerHeader({
	name,
	iconUrl,
	memberCount,
	isLoading,
}: ServerHeaderProps) {
	return (
		<div className="flex items-center gap-4 mb-8">
			{isLoading ? (
				<div className="w-16 h-16 rounded-full flex-shrink-0 bg-white/10 animate-pulse" />
			) : iconUrl ? (
				<img
					src={iconUrl}
					alt=""
					className="w-16 h-16 rounded-full flex-shrink-0"
				/>
			) : (
				<div
					className="w-16 h-16 rounded-full flex-shrink-0"
					style={{ background: "rgba(255,255,255,0.08)" }}
				/>
			)}
			<div>
				{isLoading ? (
					<div className="h-8 bg-white/10 rounded w-48 mb-2 animate-pulse" />
				) : (
					<h1>{name}</h1>
				)}
				{isLoading ? (
					<div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
				) : memberCount != null ? (
					<p
						style={{
							fontFamily: "'Inter', sans-serif",
							fontSize: "13px",
							color: "#5a6078",
							marginTop: 4,
						}}
					>
						{memberCount.toLocaleString()} members
					</p>
				) : null}
			</div>
		</div>
	);
}
