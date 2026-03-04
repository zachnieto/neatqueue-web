import { useHookstate } from "@hookstate/core";
import { useState } from "react";
import { transferCredits } from "../../services/neatqueue-service";
import { requestCheckout } from "../../services/server-service";
import globalState from "../../state";
import type { PremiumData } from "../../types";
import { floatToNDecimals, floatToNDecimalsString } from "../../util/utility";
import Modal from "../Modal";
import Panel from "../ui/Panel";
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
	const { user } = state.get();

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
			await transferCredits(guildID, transferGuildId, transferAmountCredits);
			setSuccess(`Successfully transferred ${transferAmountCredits} credits`);
			await refreshPremiumData();
		} catch (e: unknown) {
			const err = e as { response?: { data?: { detail?: string } } };
			setError(err.response?.data?.detail ?? "Transfer failed");
		}
	};

	return (
		<>
			<Panel className="col-span-1" accentColor="rgba(255,165,2,0.5)">
				<div className="flex flex-col h-full items-center justify-center">
					<h1 className="panel-title">Credits</h1>
					<h1
						className="font-rajdhani"
						style={{
							fontSize: "28px",
							fontWeight: 700,
							color: "#ffa502",
							letterSpacing: "0.04em",
							marginTop: "8px",
							marginBottom: "24px",
						}}
					>
						{floatToNDecimalsString(premiumData.credits)}
					</h1>

					<div className="flex gap-3 w-full max-w-[300px]">
						<button
							type="button"
							onClick={() => setCreditModalOpen(true)}
							className="btn-action btn-join w-full"
						>
							BUY
						</button>
						<button
							type="button"
							onClick={() => setTransferModalOpen(true)}
							className="btn-action btn-action-purple btn-join w-full"
						>
							TRANSFER
						</button>
					</div>
				</div>
			</Panel>

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
