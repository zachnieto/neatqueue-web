import axios from "axios";
import globalState, { sessionReadyState } from "../state";
import type { LoginResponse, RefreshResponse } from "../types";

const API_BASE = import.meta.env.VITE_NEATQUEUE_API;

// Separate instance for auth endpoints that need to send the refresh cookie
const authApi = axios.create({
	withCredentials: true,
	baseURL: API_BASE,
});

let loginInProgress = false;
let refreshPromise: Promise<string | null> | null = null;

export const getSession = async () => {
	// Always refresh on page load — gets fresh guilds, user info, and a new
	// access token. Falls back to clearing state if the refresh cookie is expired.
	await refreshToken();
	sessionReadyState.set(true);
};

export const discordAuth = async (code: string) => {
	loginInProgress = true;
	try {
		const resp = await authApi.post(`/auth/login`, { code });
		const data: LoginResponse = resp.data;
		globalState.auth.set({ access_token: data.access_token });
		globalState.user.set(data.user);
		globalState.guilds.set(data.guilds);
	} finally {
		loginInProgress = false;
	}
};

const doRefresh = async (): Promise<string | null> => {
	try {
		const resp = await authApi.post(`/auth/refresh`);
		const data: RefreshResponse = resp.data;
		globalState.auth.set({ access_token: data.access_token });
		globalState.user.set(data.user);
		if (data.guilds.length > 0) {
			globalState.guilds.set(data.guilds);
		}
		return data.access_token;
	} catch {
		if (!loginInProgress) {
			globalState.auth.set(undefined);
			globalState.user.set(undefined);
			globalState.guilds.set(undefined);
		}
		return null;
	}
};

export const refreshToken = async (): Promise<string | null> => {
	if (refreshPromise) return refreshPromise;
	refreshPromise = doRefresh();
	try {
		return await refreshPromise;
	} finally {
		refreshPromise = null;
	}
};

export const endSession = async () => {
	await authApi.post(`/auth/logout`).catch(() => {});
	globalState.auth.set(undefined);
	globalState.user.set(undefined);
	globalState.guilds.set(undefined);
};

export const requestCheckout = async (
	userId: string,
	userName: string,
	guildId: string,
	price: number,
	url: string,
) => {
	const resp = await authApi.post(`/checkout`, {
		userId,
		userName,
		guildId,
		price,
		url,
	});
	return resp.data;
};

export const fetchCoolifyAPIToken = async () => {
	const { auth } = globalState.get();
	const resp = await axios.get(`${API_BASE}/auth/coolify-token`, {
		headers: { Authorization: `Bearer ${auth?.access_token}` },
	});
	return resp.data;
};
