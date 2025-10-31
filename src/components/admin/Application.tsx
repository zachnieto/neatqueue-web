import { classNames } from "../../util/tailwind";
import type { CoolifyApplication } from "./Admin";

const Application = ({
	data,
	selected,
	onClick,
}: {
	data: CoolifyApplication;
	selected: boolean;
	onClick: (id: string) => void;
}) => {
	return (
		<div
			className={classNames(
				"col-span-1 bg-green-600 rounded shadow-md p-5 grid place-items-center cursor-pointer",
				selected ? "border-4 border-white" : "",
				data.status.includes("running") ? "bg-green-600" : "bg-red-600",
			)}
			onClick={() => onClick(data.uuid)}
		>
			<h2>{data.name}</h2>
			<h2>{data.status}</h2>
			{/*{JSON.stringify(application)}*/}
		</div>
	);
};

export default Application;
