import { type Dispatch, type SetStateAction, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { floatToNDecimals, floatToPrice } from "../../util/utility";

const PurchaseCredits = ({
	purchaseAmountDollars,
	setPurchaseAmountDollars,
}: {
	purchaseAmountDollars: number;
	setPurchaseAmountDollars: Dispatch<SetStateAction<number>>;
}) => {
	const CREDIT_MULTIPLIER = 1.07;
	const [purchaseAmountCredits, setPurchaseAmountCredits] = useState<number>(
		purchaseAmountDollars ** CREDIT_MULTIPLIER,
	);

	return (
		<div className="grid place-items-center">
			<div className="flex">
				<CurrencyInput
					className="text-center rounded w-20 text-black px-2 mb-5"
					name="input-name"
					value={purchaseAmountCredits}
					decimalsLimit={2}
					min={1}
					allowNegativeValue={false}
					// @ts-expect-error
					onValueChange={(val: number, name: string) => {
						const valWithDefault = val || 0;
						setPurchaseAmountDollars(
							floatToPrice(valWithDefault ** (1 / CREDIT_MULTIPLIER)),
						);
						setPurchaseAmountCredits(valWithDefault);
					}}
				/>
				<h1 className="mx-2">Credits = </h1>

				<CurrencyInput
					className="text-center rounded w-20 text-black px-2 mb-5"
					name="input-name"
					value={purchaseAmountDollars}
					decimalsLimit={2}
					min={1}
					allowNegativeValue={false}
					prefix="$"
					// @ts-expect-error
					onValueChange={(val: number, name: string) => {
						const valWithDefault = val || 0;
						setPurchaseAmountDollars(valWithDefault);
						setPurchaseAmountCredits(
							floatToNDecimals(valWithDefault ** CREDIT_MULTIPLIER),
						);
					}}
				/>
			</div>

			<input
				onChange={(e) => {
					const val = parseInt(e.target.value);
					setPurchaseAmountDollars(val);
					setPurchaseAmountCredits(floatToNDecimals(val ** CREDIT_MULTIPLIER));
				}}
				max={200}
				min={1}
				type="range"
				value={purchaseAmountDollars}
				className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"
			/>
		</div>
	);
};

export default PurchaseCredits;
