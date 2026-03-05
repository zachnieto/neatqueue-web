import { forwardRef, type InputHTMLAttributes } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
	/** Additional CSS class names to merge */
	className?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className = "", style, ...rest }, ref) => {
		return (
			<input
				ref={ref}
				className={`input-field ${className}`}
				style={style}
				{...rest}
			/>
		);
	},
);

Input.displayName = "Input";

export default Input;
