import type { Plan } from "../../types";

const Extend = ({ plan }: { plan: Plan }) => {
	return (
		<div>
			<h1 className="text-xl max-w-md">
				The current plan will be extended for 30 days at the price of{" "}
				{plan.price} credits
			</h1>
		</div>
	);
};

export default Extend;
