import type { CSSProperties, ReactNode } from "react";

type PanelProps = {
	children: ReactNode;
	/** CSS color value for the top accent bar. Defaults to blue. */
	accentColor?: string;
	className?: string;
	style?: CSSProperties;
};

export default function Panel({
	children,
	accentColor,
	className = "",
	style,
}: PanelProps) {
	return (
		<div className={`card-glass panel ${className}`} style={style}>
			<div
				className="panel-accent"
				style={
					accentColor
						? ({ "--accent-color": accentColor } as CSSProperties)
						: undefined
				}
			/>
			{children}
		</div>
	);
}
