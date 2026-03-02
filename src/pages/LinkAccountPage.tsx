import { useHookstate } from "@hookstate/core";
import { useEffect } from "react";
import { getSteamLinkUrl } from "../services/neatqueue-service";
import globalState, { sessionReadyState } from "../state";

const PENDING_STEAM_LINK_KEY = "neatqueue_pending_steam_link";

export function getPendingSteamLink(): boolean {
	try {
		return sessionStorage.getItem(PENDING_STEAM_LINK_KEY) === "1";
	} catch {
		return false;
	}
}

export function setPendingSteamLink(): void {
	try {
		sessionStorage.setItem(PENDING_STEAM_LINK_KEY, "1");
	} catch {
		// ignore
	}
}

export function clearPendingSteamLink(): void {
	try {
		sessionStorage.removeItem(PENDING_STEAM_LINK_KEY);
	} catch {
		// ignore
	}
}

export default function LinkAccountPage() {
	const state = useHookstate(globalState);
	const user = state.user.get();
	const sessionReady = useHookstate(sessionReadyState).get();

	useEffect(() => {
		const redirectUrl = `${window.location.origin}/profile?steam_linked=true`;
		if (user?.id) {
			getSteamLinkUrl(redirectUrl)
				.then((url) => {
					window.location.href = url || "/";
				})
				.catch(() => {
					window.location.href = "/";
				});
		} else if (sessionReady) {
			setPendingSteamLink();
			window.open(import.meta.env.VITE_DISCORD_AUTH, "_self");
		}
	}, [user?.id, sessionReady]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="text-gray-400">
				{user?.id ? "Redirecting to Steam..." : "Checking login..."}
			</div>
		</div>
	);
}
