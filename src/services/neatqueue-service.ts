import axios from "axios";
import globalState from "../state";
import type {
	InstancePricing,
	MatchHistory,
	NodeStatus,
	PrivateInstance,
	ServerQueuesData,
	UserProfile,
} from "../types";
import { refreshToken } from "./server-service";

const API_BASE = import.meta.env.VITE_NEATQUEUE_API;

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
	const { auth } = globalState.get();
	if (auth?.access_token) {
		config.headers.Authorization = `Bearer ${auth.access_token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const original = error.config;
		if (error.response?.status === 401 && !original._retry) {
			original._retry = true;
			const newToken = await refreshToken();
			if (newToken) {
				original.headers.Authorization = `Bearer ${newToken}`;
				return api(original);
			}
		}
		return Promise.reject(error);
	},
);

export const getStats = async () => {
	const resp = await axios.get(`${API_BASE}/stats`, { timeout: 2000 });
	globalState.stats.set(resp.data);
};

export const getGuildChannelStats = async (
	guildID: string,
	channelID: string,
) => {
	const resp = await axios.get(
		`${API_BASE}/api/leaderboard/${guildID}/${channelID}`,
	);
	return resp.data;
};

export const getLeaderboardV2 = async (
	guildID: string,
	channelID: string,
	page: number = 1,
	pageSize: number = 100,
	months?: string[],
	includeFields?: string[],
	excludeFields?: string[],
) => {
	const params = new URLSearchParams({
		page: page.toString(),
		page_size: pageSize.toString(),
	});

	if (months && months.length > 0) {
		for (const month of months) {
			params.append("month", month);
		}
	}
	if (includeFields && includeFields.length > 0) {
		for (const field of includeFields) {
			params.append("include_fields", field);
		}
	}
	if (excludeFields && excludeFields.length > 0) {
		for (const field of excludeFields) {
			params.append("exclude_fields", field);
		}
	}

	const resp = await axios.get(
		`${API_BASE}/api/v2/leaderboard/${guildID}/${channelID}?${params.toString()}`,
	);
	return resp.data;
};

export const getPlayerStats = async (
	guildID: string,
	playerID: string,
	queueName: string,
) => {
	const encodedQueueName = encodeURIComponent(queueName);
	const resp = await axios.get(
		`${API_BASE}/api/v1/playerstats/${guildID}/${playerID}/${encodedQueueName}?include_games=True`,
	);
	return resp.data;
};

export const getPremium = async (guildID: string) => {
	const resp = await api.get(`/premium/${guildID}`);
	return resp.data;
};

export const getProfile = async (): Promise<UserProfile> => {
	const resp = await api.get("/auth/profile");
	return resp.data;
};

export const unlinkSteam = async () => {
	await api.post("/auth/steam/unlink");
};

export const getSteamLinkUrl = async (
	redirectUrl: string,
): Promise<string | null> => {
	const resp = await api.get<{ steam_url: string }>("/auth/steam/link", {
		params: { redirect_url: redirectUrl },
	});
	return resp.data?.steam_url ?? null;
};

export const purchasePremium = async (guildID: string, plan: string) => {
	const resp = await api.post(`/premium/${guildID}/${plan}`, {});
	return resp.data;
};

export const transferCredits = async (
	fromGuildID: string,
	toGuildID: string,
	amount: number,
) => {
	await api.post("/transfercredits", {
		server_id: fromGuildID,
		target_server_id: toGuildID,
		amount,
	});
};

export async function getLongUrl(shortUrl: string) {
	const resp = await axios.get(`${API_BASE}/api/longurl/${shortUrl}`);
	return resp.data;
}

export async function getTranscript(guildID: string, gameNum: string) {
	const resp = await axios.get(
		`${API_BASE}/api/transcript/${guildID}/${gameNum}`,
	);
	return resp.data;
}

export async function getStatus() {
	const resp = await axios.get(`${API_BASE}/status`, { timeout: 2000 });
	const data: NodeStatus[] = resp.data;
	return data;
}

export async function getInstanceTypes() {
	const resp = await axios.get(`${API_BASE}/api/instance/prices`);
	const data: InstancePricing[] = resp.data;
	return data;
}

export async function getInstance(guildID: string) {
	const resp = await api.get(`/api/instance/${guildID}`);
	const data: PrivateInstance | undefined = resp.data;
	return data;
}

export const purchaseInstance = async (
	guildID: string,
	price: number,
	botToken: string,
) => {
	const resp = await api.post(`/api/instance/${guildID}`, {
		price,
		bot_token: botToken,
	});
	return resp.data;
};

export const extendInstance = async (guildID: string) => {
	const resp = await api.get(`/api/instance/extend/${guildID}`);
	return resp.data;
};

export const startInstance = async (guildID: string) => {
	const resp = await api.get(`/api/instance/start/${guildID}`);
	return resp.data;
};

export const rebootInstance = async (guildID: string) => {
	const resp = await api.get(`/api/instance/reboot/${guildID}`);
	return resp.data;
};

export const stopInstance = async (guildID: string) => {
	const resp = await api.get(`/api/instance/stop/${guildID}`);
	return resp.data;
};

export const deleteInstance = async (guildID: string) => {
	const resp = await api.delete(`/api/instance/${guildID}`);
	return resp.data;
};

export const updateInstanceConfig = async (
	guildID: string,
	config: {
		token?: string;
		auto_renew?: boolean;
	},
) => {
	const resp = await api.patch(`/api/instance/${guildID}`, config);
	return resp.data;
};

export const getHistory = async (
	guildID: string,
	limit: number = 1000,
	startDate: string,
	endDate: string,
) => {
	const resp = await axios.get(
		`${API_BASE}/api/history/${guildID}?limit=${limit}&start_date=${startDate}&end_date=${endDate}`,
	);
	return resp.data as {
		data: MatchHistory[];
		total?: number;
	};
};

export const getServerInfo = async (
	serverId: string,
): Promise<ServerQueuesData> => {
	const resp = await api.get(`/api/v2/server/${serverId}`);
	return resp.data;
};

export type ServerMatchPayload = {
	players: unknown[];
	teams: unknown[];
	channel: {
		id: string | number;
		name: string | null;
		type?: "text" | "voice";
	};
	queue_channel: {
		id: string | number;
		name: string | null;
		type?: "text" | "voice";
	};
	voice_channels: {
		id: string | number;
		name: string | null;
		type?: "text" | "voice";
	}[];
	ready_players?: number[];
	ready_up_mode?: number;
	timer_end?: number;
};

export const getServerMatches = async (
	serverId: string,
): Promise<Record<string, ServerMatchPayload>> => {
	const resp = await api.get(`/api/v1/matches/${serverId}`);
	return resp.data;
};
