import { type Dispatch, type SetStateAction, useState } from "react";
import { type Plans, PremiumData } from "../../types";
import { classNames } from "../../util/tailwind";

const ChangePlans = ({
	plans,
	selectedPlan,
	setSelectedPlan,
}: {
	plans: Plans;
	selectedPlan: string;
	setSelectedPlan: Dispatch<SetStateAction<string>>;
}) => {
	return (
		<div className="flex flex-col md:flex-row ">
			{Object.keys(plans).map((plan: string, i: number) => (
				<div
					key={i}
					className="m-1 max-w-sm rounded shadow-lg bg-black/25 text-white text-center basis-full"
				>
					<div className="px-6 py-4 h-full">
						<div className="font-bold text-lg md:text-2xl mb-2">{plan}</div>
						<div className="font-bold text-lg md:text-xl mb-2">
							{plans[plan].price} Credits/Month
						</div>
						<div className="text-md mb-2">{plans[plan].details}</div>
						<button
							onClick={() => setSelectedPlan(plan)}
							className={classNames(
								"btn-primary mt-auto",
								selectedPlan !== undefined && selectedPlan !== plan
									? "opacity-50 hover:opacity-100"
									: "",
							)}
						>
							Select
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default ChangePlans;
