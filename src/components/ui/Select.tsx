import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { forwardRef, type SelectHTMLAttributes } from "react";

type SelectProps = Omit<
	SelectHTMLAttributes<HTMLSelectElement>,
	"className"
> & {
	/** Additional CSS class names to merge */
	className?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className = "", style, children, ...rest }, ref) => {
		return (
			<div className="relative w-full group">
				<select
					ref={ref}
					className={`input-field appearance-none pr-10 ${className}`}
					style={{
						cursor: "pointer",
						...style,
					}}
					{...rest}
				>
					{children}
				</select>
				<div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5a6078] group-focus-within:text-[#00b4ff] transition-colors">
					<ChevronDownIcon className="w-[14px] h-[14px]" />
				</div>
			</div>
		);
	},
);

Select.displayName = "Select";

export default Select;
