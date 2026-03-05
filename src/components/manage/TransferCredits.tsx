import type { Dispatch, SetStateAction } from "react";
import Input from "../ui/Input";

const TransferCredits = ({
	transferAmountCredits,
	setTransferAmountCredits,
	transferGuildId,
	setTransferGuildId,
}: {
	transferAmountCredits: number;
	setTransferAmountCredits: Dispatch<SetStateAction<number>>;
	transferGuildId: string;
	setTransferGuildId: Dispatch<SetStateAction<string>>;
}) => {
	return (
		<div className="grid grid-cols-2 grid-rows-2 gap-3 place-items-center">
			<h1 className="mx-2 text-xl">Credits</h1>
			<Input
				type="number"
				onChange={(e) => {
					const val = parseFloat(e.target.value);
					setTransferAmountCredits(val);
				}}
				value={transferAmountCredits}
				style={{ textAlign: "center" }}
			/>
			<h1 className="mx-2 text-xl">Server ID</h1>
			<Input
				type="number"
				onChange={(e) => {
					setTransferGuildId(e.target.value);
				}}
				value={transferGuildId}
				style={{ textAlign: "center" }}
			/>
		</div>
	);
};

export default TransferCredits;
