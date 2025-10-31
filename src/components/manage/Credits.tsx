import { useHookstate } from "@hookstate/core";
import { useState } from "react";
import { transferCredits } from "../../services/neatqueue-service";
import { requestCheckout } from "../../services/server-service";
import globalState from "../../state";
import type { PremiumData } from "../../types";
import { floatToNDecimals, floatToNDecimalsString } from "../../util/utility";
import Modal from "../Modal";
import PurchaseCredits from "./PurchaseCredits";
import TransferCredits from "./TransferCredits";

const Credits = ({
	premiumData,
	refreshPremiumData,
	guildID,
	setError,
	setSuccess,
}: {
	premiumData: PremiumData;
	refreshPremiumData: () => void;
	guildID: string;
	setError: (s: string) => void;
	setSuccess: (s: string) => void;
}) => {
	const state = useHookstate(globalState);
	const { user, auth } = state.get();

	const [purchaseAmountDollars, setPurchaseAmountDollars] = useState<number>(1);
	const [transferAmountCredits, setTransferAmountCredits] = useState<number>(0);
	const [transferGuildId, setTransferGuildId] = useState<string>("");
	const [creditModalOpen, setCreditModalOpen] = useState(false);
	const [transferModalOpen, setTransferModalOpen] = useState(false);

	const handlePurchaseCredits = async () => {
		if (!user || !guildID) return;

		if (purchaseAmountDollars <= 0) {
			setError("Purchase amount must be greater than $0");
			return;
		}

		const checkout_session = await requestCheckout(
			user.id,
			`${user.username}#${user.discriminator}`,
			guildID,
			floatToNDecimals(purchaseAmountDollars),
			window.location.href,
		);
		window.location.replace(checkout_session.url);
	};

	const handleTransferCredits = async () => {
		if (!user || !guildID) return;
		try {
			await transferCredits(
				guildID,
				transferGuildId,
				transferAmountCredits,
				auth,
			);
			setSuccess(`Successfully transferred ${transferAmountCredits} credits`);
			await refreshPremiumData();
		} catch (e: any) {
			setError(e.response.data.detail);
		}
	};

	return (
		<>
			<div className="col-span-1 bg-stone-900 rounded shadow-md p-5 grid place-items-center">
				<h1 className="text-3xl">
					Credits: {floatToNDecimalsString(premiumData.credits)}
				</h1>
				<div className="flex gap-3">
					<button
						onClick={() => setCreditModalOpen(true)}
						className="btn-primary"
					>
						Buy
					</button>
					<button
						onClick={() => setTransferModalOpen(true)}
						className="btn-primary"
					>
						Transfer
					</button>
				</div>
			</div>

			<Modal
				onSubmit={handlePurchaseCredits}
				visible={creditModalOpen}
				setVisibility={setCreditModalOpen}
				title="Purchase Credits"
				submitText="Purchase"
				component={
					<PurchaseCredits
						purchaseAmountDollars={purchaseAmountDollars}
						setPurchaseAmountDollars={setPurchaseAmountDollars}
					/>
				}
			/>

			<Modal
				onSubmit={handleTransferCredits}
				visible={transferModalOpen}
				setVisibility={setTransferModalOpen}
				title="Transfer Credits"
				submitText="Transfer"
				component={
					<TransferCredits
						transferAmountCredits={transferAmountCredits}
						setTransferAmountCredits={setTransferAmountCredits}
						transferGuildId={transferGuildId}
						setTransferGuildId={setTransferGuildId}
					/>
				}
			/>
		</>
	);
};

export default Credits;
