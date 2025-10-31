import { useHookstate } from "@hookstate/core";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { purchasePremium } from "../../services/neatqueue-service";
import globalState from "../../state";
import type { PremiumData, TimeLeft } from "../../types";
import { calculateTimeLeft } from "../../util/utility";
import Modal from "../Modal";
import ChangePlans from "./ChangePlans";
import Extend from "./Extend";

const PremiumStatus = ({
	premiumData,
	setPremiumData,
	guildID,
	setError,
	setSuccess,
}: {
	premiumData: PremiumData;
	setPremiumData: Dispatch<SetStateAction<PremiumData | undefined>>;
	guildID: string;
	setError: (s: string) => void;
	setSuccess: (s: string) => void;
}) => {
	const state = useHookstate(globalState);
	const { auth } = state.get();
	const [planModalOpen, setPlanModalOpen] = useState(false);
	const [extendModalOpen, setExtendModalOpen] = useState(false);
	const [timeLeft, setTimeLeft] = useState<TimeLeft>();
	const [selectedPlan, setSelectedPlan] = useState<string>(
		premiumData.premium?.plan || "",
	);

	useEffect(() => {
		setTimeLeft(recalculateTimeLeft());
		const interval = setInterval(
			() => setTimeLeft(recalculateTimeLeft()),
			60000,
		);

		return () => {
			clearInterval(interval);
		};
	}, [premiumData]);

	const recalculateTimeLeft = () => {
		if (!premiumData.premium?.until) return;
		return calculateTimeLeft(premiumData.premium?.until);
	};

	const handlePurchase = async () => {
		if (!guildID) return;

		try {
			const prem = await purchasePremium(guildID, auth, selectedPlan);
			setSuccess(
				`30 days have been added to your server's premium timer at the cost of ${
					prem.plans[prem.premium.plan].price
				} credits`,
			);
			setPremiumData(prem);
		} catch (e: any) {
			setError(e.response.data.detail);
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
			<div className="col-span-1 bg-stone-900 rounded shadow-md p-5">
				{premiumData.premium && timeLeft ? (
					<div className="grid place-items-center">
						<h1 className="text-3xl">Premium</h1>
						<h1 className="text-2xl text-green-500 mt-5">
							{premiumData.premium.plan}
						</h1>
						<h3>
							For Another {timeLeft.days} Days, {timeLeft.hours} Hours, and{" "}
							{timeLeft.minutes} Minutes
						</h3>
						<div className="flex place-content-center gap-3">
							<button
								onClick={() => setPlanModalOpen(true)}
								className="btn-primary max-w-1/2"
							>
								Change Plan
							</button>
							<button
								onClick={() => setExtendModalOpen(true)}
								className="btn-primary"
							>
								Extend
							</button>
						</div>
					</div>
				) : (
					<div className="grid place-items-center">
						<h1 className="text-3xl">Premium</h1>
						<h1 className="text-2xl">❌</h1>
						<div className="flex gap-3">
							<button
								onClick={() => setPlanModalOpen(true)}
								className="btn-primary"
							>
								Change Plan
							</button>
						</div>
					</div>
				)}
			</div>

			<Modal
				onSubmit={handleChangePlans}
				visible={planModalOpen}
				setVisibility={setPlanModalOpen}
				title="Change Plans"
				submitText="Confirm"
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
