import { type Dispatch, type SetStateAction, useEffect } from "react";
import { classNames } from "../util/tailwind";
import { delay } from "../util/utility";

const Alert = ({
	value,
	color,
	setValue,
}: {
	value: string | null;
	color: string;
	setValue: Dispatch<SetStateAction<string | null>>;
}) => {
	useEffect(() => {
		if (!value) return;
		delay(10000).then(() => setValue(null));
	}, [value, setValue]);

	if (!value) return null;

	return (
		<div>
			<h1 className={classNames("text-3xl rounded p-1 mx-4", color)}>
				{value}
			</h1>
		</div>
	);
};

export default Alert;
