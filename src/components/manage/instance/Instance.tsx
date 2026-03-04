import _ from "lodash";
import { useEffect, useState } from "react";
import {
	deleteInstance,
	extendInstance,
	getInstance,
	getInstanceTypes,
	purchaseInstance,
	rebootInstance,
	startInstance,
	stopInstance,
	updateInstanceConfig,
} from "../../../services/neatqueue-service";
import type {
	InstancePricing,
	PrivateInstance,
	TimeLeft,
} from "../../../types";
import { calculateTimeLeft } from "../../../util/utility";
import Modal from "../../Modal";
import Panel from "../../ui/Panel";
import Input from "../../ui/Input";
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: recalculateTimeLeft depends on privateInstance; intentional mount + privateInstance sync
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: updateInstanceState is stable; intentional polling when instance exists
	useEffect(() => {
		if (!privateInstance) return;

		const intervalId = setInterval(updateInstanceState, 5000);
		updateInstanceState();

		return () => {
			clearInterval(intervalId);
			setLoading(false);
		};
	}, [privateInstance?.instance]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount only
	useEffect(() => {
		getInstanceTypes().then(setInstanceTypes);
		updateInstanceState().finally(() => setInitialLoading(false));
	}, []);

	const updateInstanceState = async () => {
		const data = await getInstance(guildID);
		setPrivateInstance(data);
		setAutoRenewState(!!data?.autoRenew);
	};

	const handlePurchase = async (instance: InstancePricing, token: string) => {
		setLoading(true);
		setCurrentAction("purchase");
		try {
			await purchaseInstance(guildID, instance.price, token);
			setSuccess("Instance is now being created");
			await refreshPremiumData();
			await updateInstanceState();
			setInstanceModalOpen(false);
		} catch (e: unknown) {
			const err = e as {
				response?: { data?: { detail?: string } };
				message?: string;
			};
			setError(
				err.response?.data?.detail ??
					err.message ??
					"Failed to create instance",
			);
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
			await extendInstance(guildID);
			setSuccess(
				`30 days have been added to the instance at a price of ${privateInstance.price} credits`,
			);
			await refreshPremiumData();
			await updateInstanceState();
		} catch (e: unknown) {
			const err = e as { response?: { data?: { detail?: string } } };
			setError(err.response?.data?.detail ?? "Failed");
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const start = async () => {
		try {
			setLoading(true);
			setCurrentAction("start");
			await startInstance(guildID);
			setSuccess("Instance is now starting");
		} catch (e: unknown) {
			const err = e as { response?: { data?: { detail?: string } } };
			setError(err.response?.data?.detail ?? "Failed");
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const reboot = async () => {
		try {
			setLoading(true);
			setCurrentAction("reboot");
			await rebootInstance(guildID);
			setSuccess("Instance is now rebooting");
		} catch (e: unknown) {
			const err = e as { response?: { data?: { detail?: string } } };
			setError(err.response?.data?.detail ?? "Failed");
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const stop = async () => {
		try {
			setLoading(true);
			setCurrentAction("stop");
			await stopInstance(guildID);
			setSuccess("Instance is now stopping");
		} catch (e: unknown) {
			const err = e as { response?: { data?: { detail?: string } } };
			setError(err.response?.data?.detail ?? "Failed");
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const terminate = async () => {
		try {
			setLoading(true);
			setCurrentAction("terminate");
			const refund = await deleteInstance(guildID);
			setSuccess(
				`Instance has been deleted, and you have been refunded ${refund.toFixed(
					1,
				)} credits`,
			);
		} catch (e: unknown) {
			const err = e as { response?: { data?: { detail?: string } } };
			setError(err.response?.data?.detail ?? "Failed");
		} finally {
			setLoading(false);
			setCurrentAction(null);
		}
	};

	const updateBotToken = async () => {
		try {
			setLoading(true);
			setCurrentAction("updateToken");
			if (botToken) {
				await updateInstanceConfig(guildID, { token: botToken });
			}
			setBotToken("");
			setSuccess("Bot token has been updated");
		} catch (e: unknown) {
			const err = e as { response?: { data?: { detail?: string } } };
			setError(err.response?.data?.detail ?? "Failed");
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
			await updateInstanceConfig(guildID, { auto_renew: newVal });
			setAutoRenewState(newVal);
			setSuccess(`Auto-renew ${newVal ? "enabled" : "disabled"}`);
		} catch (e: unknown) {
			const err = e as { response?: { data?: { detail?: string } } };
			setError(err.response?.data?.detail ?? "Failed");
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
			<Panel
				className="col-span-1 md:col-span-2"
				accentColor="rgba(165,94,234,0.5)"
			>
				<div className="flex flex-col h-full items-center justify-center w-full">
					<div className="flex items-center gap-3">
						<h1 className="panel-title">Private Instance</h1>
						<span
							className="font-mono-gaming"
							style={{
								padding: "3px 10px",
								borderRadius: 2,
								background: "rgba(165,94,234,0.12)",
								border: "1px solid rgba(165,94,234,0.35)",
								fontSize: "10px",
								fontWeight: 700,
								color: "#a55eea",
								letterSpacing: "0.08em",
							}}
						>
							BETA
						</span>
					</div>

					{!initialLoading &&
						(!privateInstance || !timeLeft ? (
							<div className="mt-6 w-full max-w-[200px]">
								<button
									type="button"
									className="btn-action btn-join w-full"
									disabled={loading}
									onClick={() => setInstanceModalOpen(true)}
								>
									BUY INSTANCE
								</button>
							</div>
						) : (
							<div className="flex flex-col items-center w-full mt-4">
								<h3
									className="font-inter"
									style={{
										fontSize: "14px",
										color: "#9aa0b4",
										marginBottom: "16px",
										textAlign: "center",
									}}
								>
									For Another {timeLeft.days} Days, {timeLeft.hours} Hours, and{" "}
									{timeLeft.minutes} Minutes
								</h3>

								<div className="flex gap-3 mt-2 justify-center w-full max-w-[200px]">
									<button
										type="button"
										onClick={() => setExtendModalOpen(true)}
										disabled={loading}
										className="btn-action btn-action-green btn-join w-full"
									>
										EXTEND
									</button>
								</div>

								<h1
									className="font-rajdhani"
									style={{
										fontSize: "20px",
										fontWeight: 700,
										color: "#e8eaf0",
										letterSpacing: "0.04em",
										marginTop: "24px",
										marginBottom: "16px",
										textAlign: "center",
									}}
								>
									Status:{" "}
									<span
										className={
											statusColor[
												privateInstance.instance as keyof typeof statusColor
											] || "text-yellow-400"
										}
										style={{ textShadow: "0 0 10px rgba(0,0,0,0.5)" }}
									>
										{_.capitalize(privateInstance.instance)}
									</span>
								</h1>

								<div className="flex flex-wrap gap-3 justify-center mb-6">
									<div className="flex items-center gap-2 mr-4 text-[#9aa0b4] text-sm font-inter">
										<input
											id="autoRenew"
											type="checkbox"
											checked={autoRenew}
											onChange={toggleAutoRenew}
											className="accent-[#00b4ff]"
										/>
										<label htmlFor="autoRenew">Auto-renew</label>
									</div>
									<button
										type="button"
										onClick={start}
										disabled={privateInstance.instance !== "stopped" || loading}
										className="btn-action btn-join px-6"
									>
										{currentAction === "start" ? "STARTING…" : "START"}
									</button>

									<button
										type="button"
										onClick={reboot}
										disabled={privateInstance.instance !== "running" || loading}
										className="btn-action btn-action-orange btn-join px-6"
									>
										{currentAction === "reboot" ? "REBOOTING…" : "REBOOT"}
									</button>

									<button
										type="button"
										onClick={stop}
										disabled={privateInstance.instance !== "running" || loading}
										className="btn-action btn-action-red btn-join px-6"
									>
										{currentAction === "stop" ? "STOPPING…" : "STOP"}
									</button>

									<button
										type="button"
										disabled={loading}
										onClick={() => setTerminateModalOpen(true)}
										className="btn-action btn-action-danger btn-join px-6"
									>
										DELETE
									</button>
								</div>

								<div className="divider" style={{ margin: "16px 0" }} />

								<div className="flex flex-col items-center gap-3 w-full max-w-[500px]">
									<div className="flex flex-col sm:flex-row items-center gap-3 w-full">
										<h1
											className="font-rajdhani"
											style={{
												fontSize: "16px",
												fontWeight: 700,
												color: "#e8eaf0",
												letterSpacing: "0.04em",
												whiteSpace: "nowrap",
											}}
										>
											BOT TOKEN:
										</h1>
										<Input
											onChange={(e) => setBotToken(e.target.value)}
											value={botToken}
											placeholder="Enter new bot token"
										/>
										<button
											type="button"
											disabled={loading || !botToken}
											onClick={updateBotToken}
											className="btn-action btn-join px-6"
										>
											{currentAction === "updateToken" ? "SETTING…" : "SET"}
										</button>
									</div>
									<button
										type="button"
										onClick={() => setBotTokenWizardOpen(true)}
										className="font-inter hover:opacity-100 transition-opacity"
										style={{
											fontSize: "12px",
											color: "#00b4ff",
											textDecoration: "underline",
											textUnderlineOffset: "2px",
											opacity: 0.8,
										}}
									>
										Need help getting a bot token?
									</button>
								</div>
							</div>
						))}
				</div>
			</Panel>

			{instanceTypes.length > 0 && (
				<InstanceCreationWizard
					visible={instanceModalOpen && !botTokenWizardOpen}
					setVisibility={setInstanceModalOpen}
					instanceTypes={instanceTypes}
					onComplete={handlePurchase}
					onOpenBotGuide={() => setBotTokenWizardOpen(true)}
				/>
			)}

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
