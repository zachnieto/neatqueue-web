import axios from "axios";
import type { CoolifyApplication } from "../components/admin/Admin";

const API_BASE = import.meta.env.VITE_COOLIFY_API;
const api = axios.create({
	baseURL: API_BASE,
});

export const getApplications = async (token: string) => {
	const resp = await api.get(`/applications`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return resp.data as CoolifyApplication[];
};

const restartApplication = async (token: string, uuid: string) => {
	const resp = await api.post(
		`/applications/${uuid}/restart`,
		{},
		{ headers: { Authorization: `Bearer ${token}` } },
	);
	return resp.data;
};

export const restartApplications = async (token: string, uuids: string[]) => {
	return Promise.all(uuids.map((uuid) => restartApplication(token, uuid)));
};

const startApplication = async (token: string, uuid: string) => {
	const resp = await api.post(
		`/applications/${uuid}/start`,
		{},
		{ headers: { Authorization: `Bearer ${token}` } },
	);
	return resp.data;
};

export const startApplications = async (token: string, uuids: string[]) => {
	return Promise.all(uuids.map((uuid) => startApplication(token, uuid)));
};

const stopApplication = async (token: string, uuid: string) => {
	const resp = await api.post(
		`/applications/${uuid}/stop`,
		{},
		{ headers: { Authorization: `Bearer ${token}` } },
	);
	return resp.data;
};

export const stopApplications = async (token: string, uuids: string[]) => {
	return Promise.all(uuids.map((uuid) => stopApplication(token, uuid)));
};
