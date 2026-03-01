import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
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
		<div className="min-h-screen lg:p-32">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				{/* Discord + Account (combined) */}
				<section className="col-span-1 bg-stone-900 rounded shadow-md p-5">
					<h2 className="text-3xl mb-4">Discord</h2>
					<div className="flex items-center gap-4">
						{profile.avatar && (
							<img
								className="h-16 w-16 rounded-full"
								src={`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}`}
								alt=""
							/>
						)}
						<div>
							<p className="font-medium">
								{profile.username}
								{profile.discriminator !== "0" && (
									<span className="text-gray-400">
										#{profile.discriminator}
									</span>
								)}
							</p>
							<p className="text-gray-400 text-sm">ID: {profile.id}</p>
							<div className="flex items-center gap-2 mt-2">
								<span
									className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
										profile.premium
											? "bg-violet-900 text-white"
											: "bg-stone-700 text-gray-300"
									}`}
								>
									{profile.premium ? "Premium" : "Free"}
								</span>
								{profile.admin && (
									<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-600/80 text-white">
										Admin
									</span>
								)}
							</div>
						</div>
					</div>
				</section>

				{/* Steam section */}
				<section className="col-span-1 bg-stone-900 rounded shadow-md p-5">
					<h2 className="text-3xl mb-4">Steam</h2>
					{profile.steam ? (
						<div>
							<div className="flex items-center gap-4 mb-4">
								{profile.steam.avatar && (
									<img
										className="h-16 w-16 rounded"
										src={profile.steam.avatar}
										alt=""
									/>
								)}
								<div className="min-w-0">
									<p className="font-medium">{profile.steam.username}</p>
									<p className="text-gray-400 text-sm mt-1">
										Steam ID:{" "}
										<span className="font-mono text-xs break-all">
											{profile.steam.id}
										</span>
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={handleUnlinkSteam}
								disabled={unlinkLoading}
								className="btn-primary"
							>
								{unlinkLoading ? "Unlinking..." : "Unlink"}
							</button>
						</div>
					) : (
						<div>
							<p className="text-gray-400 mb-4">
								Link your Steam account to connect it with your NeatQueue
								profile.
							</p>
							<button
								type="button"
								onClick={handleLinkSteam}
								className="rounded-md bg-violet-900 px-3 py-2 text-xl font-medium text-white hover:translate-y-1 transition-all"
							>
								Link
							</button>
						</div>
					)}
				</section>
			</div>

			<div className="flex justify-center mt-10">
				<button type="button" onClick={handleLogout} className="btn-primary">
					Logout
				</button>
			</div>
		</div>
	);
}
