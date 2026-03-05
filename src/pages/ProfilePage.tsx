import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import PageLayout from "../components/ui/PageLayout";
import Panel from "../components/ui/Panel";
import SectionHeader from "../components/ui/SectionHeader";
import { useToast } from "../hooks/useToast";
import {
	getProfile,
	getSteamLinkUrl,
	unlinkSteam,
} from "../services/neatqueue-service";
import { endSession } from "../services/server-service";

export default function ProfilePage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const { showToast } = useToast();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [unlinkLoading, setUnlinkLoading] = useState(false);

	const handleLogout = () => {
		navigate("/");
		endSession();
	};

	const { data: profile, isLoading } = useQuery({
		queryKey: ["profile"],
		queryFn: getProfile,
	});

	useEffect(() => {
		if (searchParams.get("steam_linked") === "true") {
			showToast("Steam account linked", { variant: "success" });
			setSearchParams({}, { replace: true });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		}
	}, [searchParams, showToast, setSearchParams, queryClient]);

	const handleLinkSteam = async () => {
		const redirectUrl = `${window.location.origin}/profile?steam_linked=true`;
		try {
			const url = await getSteamLinkUrl(redirectUrl);
			if (url) window.location.href = url;
			else showToast("Please log in to link Steam", { variant: "error" });
		} catch {
			showToast("Failed to start Steam linking", { variant: "error" });
		}
	};

	const handleUnlinkSteam = async () => {
		setUnlinkLoading(true);
		try {
			await unlinkSteam();
			showToast("Steam account unlinked", { variant: "success" });
			queryClient.invalidateQueries({ queryKey: ["profile"] });
		} catch {
			showToast("Failed to unlink Steam", { variant: "error" });
		} finally {
			setUnlinkLoading(false);
		}
	};

	if (isLoading || !profile) {
		return <Loading />;
	}

	return (
		<PageLayout>
			<SectionHeader
				title="Profile"
				subtitle="Manage your account and linked services."
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Discord Panel */}
				<Panel accentColor="rgba(88,101,242,0.6)">
					<h2 className="panel-title" style={{ marginBottom: 20 }}>
						Discord
					</h2>
					<div className="divider" style={{ marginBottom: 20 }} />

					<div className="flex items-center gap-4">
						{profile.avatar && (
							<img
								className="w-14 h-14 rounded-full flex-shrink-0 avatar-ring"
								src={`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`}
								alt=""
							/>
						)}
						<div style={{ minWidth: 0 }}>
							<div
								className="font-rajdhani"
								style={{
									fontSize: 18,
									fontWeight: 700,
									color: "#e8eaf0",
									letterSpacing: "0.04em",
									lineHeight: 1.2,
								}}
							>
								{profile.username}
								{profile.discriminator !== "0" && (
									<span style={{ color: "#5a6078", fontWeight: 500 }}>
										#{profile.discriminator}
									</span>
								)}
							</div>
							<div
								className="section-subtitle"
								style={{ marginTop: 4, fontSize: 12 }}
							>
								ID: {profile.id}
							</div>
							<div
								className="flex items-center gap-2"
								style={{ marginTop: 10 }}
							>
								<span
									style={{
										display: "inline-flex",
										alignItems: "center",
										padding: "3px 10px",
										borderRadius: 3,
										fontSize: 11,
										fontFamily: "'Rajdhani', sans-serif",
										fontWeight: 700,
										letterSpacing: "0.08em",
										textTransform: "uppercase",
										border: profile.premium
											? "1px solid rgba(165,94,234,0.4)"
											: "1px solid rgba(255,255,255,0.1)",
										color: profile.premium ? "#b87af3" : "#5a6078",
										background: profile.premium
											? "rgba(165,94,234,0.1)"
											: "rgba(255,255,255,0.03)",
									}}
								>
									{profile.premium ? "Premium" : "Free"}
								</span>
								{profile.admin && (
									<span
										style={{
											display: "inline-flex",
											alignItems: "center",
											padding: "3px 10px",
											borderRadius: 3,
											fontSize: 11,
											fontFamily: "'Rajdhani', sans-serif",
											fontWeight: 700,
											letterSpacing: "0.08em",
											textTransform: "uppercase",
											border: "1px solid rgba(255,165,2,0.4)",
											color: "#ffc048",
											background: "rgba(255,165,2,0.1)",
										}}
									>
										Admin
									</span>
								)}
							</div>
						</div>
					</div>
				</Panel>

				{/* Steam Panel */}
				<Panel accentColor="rgba(102,192,244,0.5)">
					<h2 className="panel-title" style={{ marginBottom: 20 }}>
						Steam
					</h2>
					<div className="divider" style={{ marginBottom: 20 }} />

					{profile.steam ? (
						<>
							<div
								className="flex items-center gap-4"
								style={{ marginBottom: 20 }}
							>
								{profile.steam.avatar && (
									<img
										className="w-14 h-14 rounded flex-shrink-0"
										src={profile.steam.avatar}
										alt=""
										style={{ border: "1px solid rgba(255,255,255,0.1)" }}
									/>
								)}
								<div style={{ minWidth: 0 }}>
									<div
										className="font-rajdhani"
										style={{
											fontSize: 18,
											fontWeight: 700,
											color: "#e8eaf0",
											letterSpacing: "0.04em",
											lineHeight: 1.2,
										}}
									>
										{profile.steam.username}
									</div>
									<div
										className="section-subtitle"
										style={{ marginTop: 4, fontSize: 12 }}
									>
										Steam ID:{" "}
										<span className="font-mono-gaming" style={{ fontSize: 11 }}>
											{profile.steam.id}
										</span>
									</div>
								</div>
							</div>
							<button
								type="button"
								onClick={handleUnlinkSteam}
								disabled={unlinkLoading}
								className="btn-action btn-action-danger"
							>
								{unlinkLoading ? "UNLINKING..." : "UNLINK"}
							</button>
						</>
					) : (
						<>
							<p
								className="section-subtitle"
								style={{ marginTop: 0, marginBottom: 20 }}
							>
								Link your Steam account to connect it with your NeatQueue
								profile.
							</p>
							<button
								type="button"
								onClick={handleLinkSteam}
								className="btn-action btn-action-green"
							>
								LINK STEAM
							</button>
						</>
					)}
				</Panel>
			</div>

			{/* Logout */}
			<div className="flex justify-center" style={{ marginTop: 40 }}>
				<button
					type="button"
					onClick={handleLogout}
					className="btn-action btn-action-danger"
					style={{ minWidth: 120 }}
				>
					LOGOUT
				</button>
			</div>
		</PageLayout>
	);
}
