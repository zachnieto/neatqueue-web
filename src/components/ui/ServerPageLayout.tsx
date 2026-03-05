import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "./PageLayout";
import SectionHeader from "./SectionHeader";
import ServerHeader from "./ServerHeader";

const backButtonStyle = {
	fontFamily: "'Inter', sans-serif",
	fontSize: "13px",
	color: "#7a8099",
	background: "none",
	border: "none",
	cursor: "pointer",
} as const;

export type ServerPageLayoutProps = {
	/** Server display name */
	serverName?: string;
	/** Server icon URL */
	serverIconUrl?: string | null;
	/** Member count for subtitle */
	memberCount?: number | null;
	/** Show loading skeletons for server header */
	serverHeaderLoading?: boolean;
	/** Optional section title (e.g. "Manage", "Settings"). When set, uses 3-column header layout with title left and server center. */
	sectionTitle?: string;
	/** Optional subtitle shown below section title (when sectionTitle is set). */
	sectionSubtitle?: string;
	/** Optional content to the right of "Back to servers" (e.g. WsStatusIndicator) */
	topBarTrailing?: ReactNode;
	children: ReactNode;
};

export default function ServerPageLayout({
	serverName,
	serverIconUrl,
	memberCount,
	serverHeaderLoading = false,
	sectionTitle,
	sectionSubtitle,
	topBarTrailing,
	children,
}: ServerPageLayoutProps) {
	const navigate = useNavigate();

	return (
		<PageLayout>
			{/* Top bar: back + optional trailing */}
			<div className="flex items-center justify-between mb-6">
				<button
					type="button"
					onClick={() => navigate("/servers")}
					style={backButtonStyle}
					className="hover:opacity-80"
				>
					← Back to servers
				</button>
				{topBarTrailing}
			</div>

			{/* Server header row: optional section title + ServerHeader (centered) */}
			{sectionTitle != null ? (
				<div className="flex items-center mb-8 [&>*]:mb-0">
					<div className="flex-shrink-0 [&>*]:mb-0">
						<SectionHeader title={sectionTitle} subtitle={sectionSubtitle} />
					</div>
					<div className="flex-1 flex justify-center [&>*]:mb-0">
						<ServerHeader
							name={serverName}
							iconUrl={serverIconUrl}
							memberCount={memberCount}
							isLoading={serverHeaderLoading}
						/>
					</div>
					<div
						className="flex-shrink-0 [&>*]:mb-0"
						style={{ visibility: "hidden" }}
					>
						<SectionHeader title={sectionTitle} subtitle={sectionSubtitle} />
					</div>
				</div>
			) : (
				<div className="flex justify-center [&>*]:mb-0 mb-8">
					<ServerHeader
						name={serverName}
						iconUrl={serverIconUrl}
						memberCount={memberCount}
						isLoading={serverHeaderLoading}
					/>
				</div>
			)}

			{children}
		</PageLayout>
	);
}
