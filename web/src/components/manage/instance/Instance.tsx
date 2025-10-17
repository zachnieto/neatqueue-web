import { useHookstate } from "@hookstate/core";
import _ from "lodash";
import { useEffect, useState } from "react";
import {
	deleteInstance,
	extendInstance,
	getInstance,
	getInstanceTypes,
	purchaseInstance,
	rebootInstance,
	setAutoRenew,
	startInstance,
	stopInstance,
	updateToken,
} from "../../../services/neatqueue-service";
import globalState from "../../../state";
import {
	type InstancePricing,
	type PrivateInstance,
	PrivateInstanceState,
	type TimeLeft,
} from "../../../types";
import { classNames } from "../../../util/tailwind";
import { calculateTimeLeft } from "../../../util/utility";
import Modal from "../../Modal";
import BotTokenWizard from "./BotTokenWizard";
import ExtendModal from "./ExtendModal";
import InstanceCreationWizard from "./InstanceCreationWizard";
import TerminateModal from "./TerminateModal";

const Instance = ({
	guildID,
	setError,
	setSuccess,
	refreshPremiumData,
}: {
	guildID: string;
	setError: (s: string) => void;
	setSuccess: (s: string) => void;
	refreshPremiumData: () => Promise<void>;
}) => {
	const state = useHookstate(globalState);
	const { auth } = state.get();
	const [instanceModalOpen, setInstanceModalOpen] = useState<boolean>(false);
	const [extendModalOpen, setExtendModalOpen] = useState<boolean>(false);
	const [terminateModalOpen, setTerminateModalOpen] = useState<boolean>(false);
	const [botTokenWizardOpen, setBotTokenWizardOpen] = useState<boolean>(false);
	const [instanceTypes, setInstanceTypes] = useState<InstancePricing[]>([]);
	const [botToken, setBotToken] = useState<string>("");
	const [autoRenew, setAutoRenewState] = useState<boolean>(false);

	const [loading, setLoading] = useState<boolean>(false);
	const [initialLoading, setInitialLoading] = useState<boolean>(true);

	const [currentAction, setCurrentAction] = useState<
		| null
		| "purchase"
		| "extend"
		| "start"
		| "reboot"
		| "stop"
		| "terminate"
		| "updateToken"
		| "toggleAutoRenew"
	>(null);

	const [privateInstance, setPrivateInstance] = useState<PrivateInstance>();

	const [timeLeft, setTimeLeft] = useState<TimeLeft>();

	const statusColor = {
		running: "text-green-600",
		online: "text-green-600",
		stopped: "text-red-600",
		offline: "text-red-600",
	};

	useEffect(() => {
		setTimeLeft(recalculateTimeLeft());
		const interval = setInterval(
			() => setTimeLeft(recalculateTimeLeft()),
			60000,
		);
		return () => {
			clearInterval(interval);
		};
	}, [privateInstance, privateInstance?.until]);

	useEffect(() => {
		if (!privateInstance) return;

		let intervalId: NodeJS.Timer;
		updateInstanceState();
		intervalId = setInterval(updateInstanceState, 5000);

		return () => {
			clearInterval(intervalId);
			setLoading(false);
		};
	}, [privateInstance?.instance]);

	useEffect(() => {
		getInstanceTypes().then(setInstanceTypes);
		updateInstanceState().finally(() => setInitialLoading(false));
	}, []);

	const updateInstanceState = async () => {
		const data = await getInstance(guildID, auth);
		setPrivateInstance(data);
		setAutoRenewState(!!data?.autoRenew);
	};

	const handlePurchase = async (instance: InstancePricing, token: string) => {
		setLoading(true);
		setCurrentAction("purchase");
		setInstanceModalOpen(false);
		try {
			await purchaseInstance(guildID, auth, instance.price, token);
			setSuccess("Instance is now being created");
			await refreshPremiumData();
			await updateInstanceState();
		} catch (e: any) {
			setError(
				e.response?.data?.detail || e.message || "Failed to create instance",
			);
			throw e; // Re-throw so wizard can handle it
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const handleExtend = async () => {
		if (!privateInstance) return;

		try {
			setLoading(true);
			setCurrentAction("extend");
			await extendInstance(guildID, auth);
			setSuccess(
				`30 days have been added to the instance at a price of ${privateInstance.price} credits`,
			);
			await refreshPremiumData();
			await updateInstanceState();
		} catch (e: any) {
			setError(e.response.data.detail);
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const start = async () => {
		try {
			setLoading(true);
			setCurrentAction("start");
			await startInstance(guildID, auth);
			setSuccess("Instance is now starting");
		} catch (e: any) {
			setError(e.response.data.detail);
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const reboot = async () => {
		try {
			setLoading(true);
			setCurrentAction("reboot");
			await rebootInstance(guildID, auth);
			setSuccess("Instance is now rebooting");
		} catch (e: any) {
			setError(e.response.data.detail);
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const stop = async () => {
		try {
			setLoading(true);
			setCurrentAction("stop");
			await stopInstance(guildID, auth);
			setSuccess("Instance is now stopping");
		} catch (e: any) {
			setError(e.response.data.detail);
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const terminate = async () => {
		try {
			setLoading(true);
			setCurrentAction("terminate");
			const refund = await deleteInstance(guildID, auth);
			setSuccess(
				`Instance has been deleted, and you have been refunded ${refund.toFixed(
					1,
				)} credits`,
			);
		} catch (e: any) {
			setError(e.response.data.detail);
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const updateBotToken = async () => {
		try {
			setLoading(true);
			setCurrentAction("updateToken");
			await updateToken(guildID, auth, botToken!);
			setBotToken("");
			setSuccess("Bot token has been updated");
		} catch (e: any) {
			setError(e.response.data.detail);
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const toggleAutoRenew = async () => {
		try {
			setLoading(true);
			setCurrentAction("toggleAutoRenew");
			const newVal = !autoRenew;
			await setAutoRenew(guildID, auth, newVal);
			setAutoRenewState(newVal);
			setSuccess(`Auto-renew ${newVal ? "enabled" : "disabled"}`);
		} catch (e: any) {
			setError(e.response.data.detail);
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const recalculateTimeLeft = () => {
		if (!privateInstance?.until) return;
		return calculateTimeLeft(privateInstance.until);
	};

	return (
		<>
			<div className="col-span-1 md:col-span-2 bg-stone-900 rounded shadow-md p-5 grid place-items-center">
				<h1 className="text-3xl">BETA</h1>
				<h1 className="text-3xl">Private Instance</h1>

				{!initialLoading &&
					(!privateInstance || !timeLeft ? (
						<button
							className="btn-primary"
							disabled={loading}
							onClick={() => setInstanceModalOpen(true)}
						>
							Buy
						</button>
					) : (
						<div>
							<h3 className="text-center">
								For Another {timeLeft.days} Days, {timeLeft.hours} Hours, and{" "}
								{timeLeft.minutes} Minutes
							</h3>

							<div className="flex gap-3 mt-3 justify-center">
								{/*<button onClick={updateInstanceState} className="btn-primary">*/}
								{/*  Refresh Status*/}
								{/*</button>*/}

								<button
									onClick={() => setExtendModalOpen(true)}
									disabled={loading}
									className="btn-primary"
								>
									Extend
								</button>
							</div>

							<h1 className="text-2xl text-center mt-5">
								Instance Status:{" "}
								<span
									className={
										statusColor[
											privateInstance.instance as keyof typeof statusColor
										] || "text-yellow-400"
									}
								>
									{_.capitalize(privateInstance.instance)}
								</span>
							</h1>

							<div className="flex gap-3 justify-center">
								<div className="flex items-center gap-2 mr-4">
									<input
										id="autoRenew"
										type="checkbox"
										checked={autoRenew}
										onChange={toggleAutoRenew}
									/>
									<label htmlFor="autoRenew">Auto-renew</label>
								</div>
								<button
									onClick={start}
									disabled={privateInstance.instance !== "stopped" || loading}
									className="btn-primary"
								>
									{currentAction === "start" ? "Starting…" : "Start"}
								</button>

								<button
									onClick={reboot}
									disabled={privateInstance.instance !== "running" || loading}
									className="btn-primary"
								>
									{currentAction === "reboot" ? "Rebooting…" : "Reboot"}
								</button>

								<button
									onClick={stop}
									disabled={privateInstance.instance !== "running" || loading}
									className="btn-primary"
								>
									{currentAction === "stop" ? "Stopping…" : "Stop"}
								</button>

								<button
									disabled={loading}
									onClick={() => setTerminateModalOpen(true)}
									className="btn-primary"
								>
									Delete
								</button>
							</div>
							<div className="flex flex-col items-center mt-7 gap-2">
								<div className="flex items-center gap-1">
									<h1 className="text-xl">Bot Token: </h1>
									<input
										onChange={(e) => setBotToken(e.target.value)}
										value={botToken}
										placeholder="Enter new bot token"
										className="text-center rounded w-80 text-black px-2"
									/>
									<button
										disabled={loading || !botToken}
										onClick={updateBotToken}
										className="btn-primary"
									>
										{currentAction === "updateToken" ? "Setting…" : "Set"}
									</button>
								</div>
								<button
									onClick={() => setBotTokenWizardOpen(true)}
									className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors"
								>
									Need help getting a bot token?
								</button>
							</div>
						</div>
					))}
			</div>

			<InstanceCreationWizard
				visible={instanceModalOpen && !botTokenWizardOpen}
				setVisibility={setInstanceModalOpen}
				instanceTypes={instanceTypes}
				onComplete={handlePurchase}
				onOpenBotGuide={() => setBotTokenWizardOpen(true)}
			/>

			{privateInstance && (
				<>
					<Modal
						onSubmit={handleExtend}
						visible={extendModalOpen}
						setVisibility={setExtendModalOpen}
						title="Extend Instance?"
						submitText="Confirm"
						component={<ExtendModal price={privateInstance?.price} />}
					/>
					<Modal
						onSubmit={terminate}
						visible={terminateModalOpen}
						setVisibility={setTerminateModalOpen}
						title="Delete Instance?"
						submitText="Confirm"
						component={<TerminateModal />}
					/>
				</>
			)}

			<BotTokenWizard
				visible={botTokenWizardOpen}
				setVisibility={setBotTokenWizardOpen}
			/>
		</>
	);
};

export default Instance;
