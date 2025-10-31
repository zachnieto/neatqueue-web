import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
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
		delay(10000).then(() => setValue(null));
	}, [value]);

	if (!value) return <></>;

	return (
		<div>
			<h1 className={classNames("text-3xl rounded p-1 mx-4", color)}>
				{value}
			</h1>
		</div>
	);
};

export default Alert;
