import axios from "axios";
import globalState from "../state";
import type { Session } from "../types";

const API_BASE = import.meta.env.VITE_NEATQUEUE_API;
const api = axios.create({
	withCredentials: true,
	baseURL: API_BASE,
});

export const getSession = async () => {
	const resp = await api.get(`/session`);
	const data: Session = resp.data;
	console.log(data);
	globalState.auth.set(data.auth);
	globalState.user.set(data.user);
	globalState.guilds.set(data.guilds);
};

export const endSession = async () => {
	api.delete(`/session`);
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
	const resp = await api.post(`/checkout`, {
		userId: userId,
		userName: userName,
		guildId: guildId,
		price: price,
		url: url,
	});
	return resp.data;
};

export const discordAuth = async (code: string) => {
	const resp = await api.post(`/session/auth`, {
		code: code,
	});
	const data = resp.data;
	globalState.auth.set(data.auth);
	globalState.user.set(data.user);
	globalState.guilds.set(data.guilds);
	console.log(data);
};

export const fetchCoolifyAPIToken = async () => {
	const resp = await api.get(`/coolifyapitoken`);
	return resp.data;
};
