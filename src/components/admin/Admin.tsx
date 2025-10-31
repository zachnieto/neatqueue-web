import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
	getApplications,
	restartApplications,
	startApplications,
	stopApplications,
} from "../../services/coolify-service";
import { fetchCoolifyAPIToken } from "../../services/server-service";
import Alert from "../Alert";
import Loading from "../Loading";
import Application from "./Application";

export type CoolifyApplication = {
	name: string;
	uuid: string;
	status: string;
	environment_id: number;
};

const NEATQUEUE_PROD_ENV_ID = 34;

const Admin = () => {
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [selectedApplications, setSelectedApplications] = useState<string[]>(
		[],
	);

	const { data: coolifyApiToken } = useQuery({
		queryKey: ["coolifyApiToken"],
		queryFn: fetchCoolifyAPIToken,
	});
	const { data: applications } = useQuery({
		queryKey: ["applications"],
		queryFn: () => getApplications(coolifyApiToken),
		enabled: !!coolifyApiToken,
		refetchInterval: 1000,
	});
	const startApps = useMutation({
		mutationFn: (uuids: string[]) => startApplications(coolifyApiToken, uuids),
	});
	const restartApps = useMutation({
		mutationFn: (uuids: string[]) =>
			restartApplications(coolifyApiToken, uuids),
	});
	const stopApps = useMutation({
		mutationFn: (uuids: string[]) => stopApplications(coolifyApiToken, uuids),
	});

	const selectApp = (id: string) => {
		console.log(selectedApplications);
		if (selectedApplications.includes(id)) {
			setSelectedApplications(selectedApplications.filter((app) => app !== id));
		} else {
			setSelectedApplications([...selectedApplications, id]);
		}
	};

	const prodApps =
		applications?.filter(
			(app: CoolifyApplication) => app.environment_id === NEATQUEUE_PROD_ENV_ID,
		) ?? [];
	const nodes = prodApps.filter((app) =>
		app.name.toLowerCase().includes("node"),
	);
	const otherApps = prodApps.filter(
		(app) => !app.name.toLowerCase().includes("node"),
	);

	const loading =
		startApps.isPending || restartApps.isPending || stopApps.isPending;
	const disableActions = loading || !selectedApplications.length;

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="min-h-screen">
			<div className="text-center mb-5">
				<h1 className="text-5xl">Admin Dashboard</h1>
				<Alert value={success} setValue={setSuccess} color="bg-green-600" />
				<Alert value={error} setValue={setError} color="bg-red-600" />
			</div>

			<div className="flex justify-center gap-4 my-10">
				<button
					className="btn-primary"
					disabled={loading}
					onClick={() => restartApps.mutate(nodes.map((n) => n.uuid))}
				>
					Full Restart {nodes.length} NeatQueue Nodes
				</button>
			</div>

			<div className="flex justify-center gap-4 my-10">
				<button
					className="btn-primary"
					disabled={disableActions}
					onClick={() => startApps.mutate(selectedApplications)}
				>
					Start Selected
				</button>
				<button
					className="btn-primary"
					disabled={disableActions}
					onClick={() => restartApps.mutate(selectedApplications)}
				>
					Restart Selected
				</button>
				<button
					className="btn-primary"
					disabled={disableActions}
					onClick={() => stopApps.mutate(selectedApplications)}
				>
					Stop Selected
				</button>
			</div>

			<div className="flex justify-center">
				<div className="flex flex-col gap-12 col-span-1 bg-stone-900 rounded shadow-md w-fit p-10">
					<div className="flex flex-wrap justify-center gap-8">
						{nodes.map((data) => (
							<Application
								key={data.uuid}
								data={data}
								selected={selectedApplications.includes(data.uuid)}
								onClick={() => selectApp(data.uuid)}
							/>
						))}
					</div>

					<div className="flex flex-wrap justify-center gap-8">
						{otherApps.map((data) => (
							<Application
								key={data.uuid}
								data={data}
								selected={selectedApplications.includes(data.uuid)}
								onClick={() => selectApp(data.uuid)}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Admin;
