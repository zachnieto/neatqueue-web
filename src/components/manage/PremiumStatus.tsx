import { useCallback, useEffect, useState } from "react";
import { purchasePremium } from "../../services/neatqueue-service";
import type { PremiumData, TimeLeft } from "../../types";
import { calculateTimeLeft } from "../../util/utility";
import Modal from "../Modal";
import Panel from "../ui/Panel";
import ChangePlans from "./ChangePlans";
import Extend from "./Extend";

const PremiumStatus = ({
	premiumData,
	refreshPremiumData,
	guildID,
	setError,
	setSuccess,
}: {
	premiumData: PremiumData;
	refreshPremiumData: () => Promise<void>;
	guildID: string;
	setError: (s: string) => void;
	setSuccess: (s: string) => void;
}) => {
	const [planModalOpen, setPlanModalOpen] = useState(false);
	const [extendModalOpen, setExtendModalOpen] = useState(false);
	const [timeLeft, setTimeLeft] = useState<TimeLeft>();
	const [selectedPlan, setSelectedPlan] = useState<string>(
		premiumData.premium?.plan || "",
	);

	const recalculateTimeLeft = useCallback(() => {
		if (!premiumData.premium?.until) return;
		return calculateTimeLeft(premiumData.premium?.until);
	}, [premiumData.premium?.until]);

	useEffect(() => {
		setTimeLeft(recalculateTimeLeft());
		const interval = setInterval(
			() => setTimeLeft(recalculateTimeLeft()),
			60000,
		);

		return () => {
			clearInterval(interval);
		};
	}, [recalculateTimeLeft]);

	const handlePurchase = async () => {
		if (!guildID) return;

		try {
			const prem = await purchasePremium(guildID, selectedPlan);
			setSuccess(
				`30 days have been added to your server's premium timer at the cost of ${
					prem.plans[prem.premium.plan].price
				} credits`,
			);
			await refreshPremiumData();
		} catch (e: unknown) {
			const err = e as { response?: { data?: { detail?: string } } };
			setError(err.response?.data?.detail ?? "Purchase failed");
			return;
		}

		setTimeLeft(recalculateTimeLeft());
	};

	const handleChangePlans = async () => {
		if (selectedPlan === premiumData.premium?.plan) return;
		await handlePurchase();
	};

	return (
		<>
			<Panel className="col-span-1">
				{premiumData.premium && timeLeft ? (
					<div className="flex flex-col h-full items-center justify-center">
						<h1 className="panel-title">Premium</h1>
						<h1
							className="font-rajdhani"
							style={{
								fontSize: "28px",
								fontWeight: 700,
								color: "#39d98a",
								letterSpacing: "0.04em",
								marginTop: "12px",
							}}
						>
							{premiumData.premium.plan}
						</h1>
						<h3
							className="font-inter"
							style={{
								fontSize: "14px",
								color: "#9aa0b4",
								marginTop: "8px",
								marginBottom: "24px",
								textAlign: "center",
							}}
						>
							For Another {timeLeft.days} Days, {timeLeft.hours} Hours, and{" "}
							{timeLeft.minutes} Minutes
						</h3>
						<div className="flex place-content-center gap-3 w-full max-w-[300px]">
							<button
								type="button"
								onClick={() => setPlanModalOpen(true)}
								className="btn-action btn-join w-full"
							>
								CHANGE PLAN
							</button>
							<button
								type="button"
								onClick={() => setExtendModalOpen(true)}
								className="btn-action btn-action-green btn-join w-full"
							>
								EXTEND
							</button>
						</div>
					</div>
				) : (
					<div className="flex flex-col h-full items-center justify-center">
						<h1 className="panel-title">Premium</h1>
						<h1 className="text-2xl mt-3 mb-6">❌</h1>
						<div className="flex gap-3 w-full max-w-[200px]">
							<button
								type="button"
								onClick={() => setPlanModalOpen(true)}
								className="btn-action btn-join w-full"
							>
								SUBSCRIBE
							</button>
						</div>
					</div>
				)}
			</Panel>

			<Modal
				onSubmit={handleChangePlans}
				visible={planModalOpen}
				setVisibility={setPlanModalOpen}
				title="Change Plans"
				submitText="Confirm"
				className="max-w-3xl"
				component={
					<ChangePlans
						selectedPlan={selectedPlan}
						setSelectedPlan={setSelectedPlan}
						plans={premiumData.plans}
					/>
				}
			/>
			{premiumData.premium && (
				<Modal
					onSubmit={handlePurchase}
					visible={extendModalOpen}
					setVisibility={setExtendModalOpen}
					title="Extend Plan?"
					submitText="Confirm"
					component={
						<Extend plan={premiumData.plans[premiumData.premium.plan]} />
					}
				/>
			)}
		</>
	);
};

export default PremiumStatus;
