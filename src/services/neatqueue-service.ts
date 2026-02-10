import axios from "axios";
import globalState from "../state";
import type {
	Auth,
	InstancePricing,
	MatchHistory,
	NodeStatus,
	PrivateInstance,
} from "../types";

const API_BASE = import.meta.env.VITE_NEATQUEUE_API;

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

export const getPremium = async (guildID: string, oauth: Auth) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.get(`${API_BASE}/premium/${guildID}`, config);
	return resp.data;
};

export const purchasePremium = async (
	guildID: string,
	oauth: Auth,
	plan: string,
) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.post(
		`${API_BASE}/premium/${guildID}/${plan}`,
		{},
		config,
	);
	return resp.data;
};

export const transferCredits = async (
	fromGuildID: string,
	toGuildID: string,
	amount: number,
	oauth: Auth,
) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	await axios.post(
		`${API_BASE}/transfercredits`,
		{
			server_id: fromGuildID,
			target_server_id: toGuildID,
			amount: amount,
		},
		config,
	);
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

export async function getInstance(guildID: string, oauth: Auth) {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.get(`${API_BASE}/api/instance/${guildID}`, config);
	const data: PrivateInstance | undefined = resp.data;
	return data;
}

export const purchaseInstance = async (
	guildID: string,
	oauth: Auth,
	price: number,
	botToken: string,
) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.post(
		`${API_BASE}/api/instance/${guildID}`,
		{
			price,
			bot_token: botToken,
		},
		config,
	);
	return resp.data;
};

export const extendInstance = async (guildID: string, oauth: Auth) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.get(
		`${API_BASE}/api/instance/extend/${guildID}`,
		config,
	);
	return resp.data;
};

export const startInstance = async (guildID: string, oauth: Auth) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.get(
		`${API_BASE}/api/instance/start/${guildID}`,
		config,
	);
	return resp.data;
};

export const rebootInstance = async (guildID: string, oauth: Auth) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.get(
		`${API_BASE}/api/instance/reboot/${guildID}`,
		config,
	);
	return resp.data;
};

export const stopInstance = async (guildID: string, oauth: Auth) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.get(
		`${API_BASE}/api/instance/stop/${guildID}`,
		config,
	);
	return resp.data;
};

export const deleteInstance = async (guildID: string, oauth: Auth) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.delete(
		`${API_BASE}/api/instance/${guildID}`,
		config,
	);
	return resp.data;
};

export const updateToken = async (
	guildID: string,
	oauth: Auth,
	botToken: string,
) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.patch(
		`${API_BASE}/api/instance/${guildID}`,
		{
			token: botToken,
		},
		config,
	);
	return resp.data;
};

export const setAutoRenew = async (
	guildID: string,
	oauth: Auth,
	enabled: boolean,
) => {
	const config = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.patch(
		`${API_BASE}/api/instance/${guildID}`,
		{
			auto_renew: enabled,
		},
		config,
	);
	return resp.data;
};

// Unified function to update instance configuration (token and/or auto_renew)
export const updateInstanceConfig = async (
	guildID: string,
	oauth: Auth,
	config: {
		token?: string;
		auto_renew?: boolean;
	},
) => {
	const axiosConfig = {
		headers: {
			authorization: `${oauth?.token_type} ${oauth?.access_token}`,
		},
	};

	const resp = await axios.patch(
		`${API_BASE}/api/instance/${guildID}`,
		config,
		axiosConfig,
	);
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
