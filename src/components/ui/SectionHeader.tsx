import type { ReactNode } from "react";

type SectionHeaderProps = {
	title: string;
	subtitle?: string;
	/** Extra content rendered to the right of the title row */
	trailing?: ReactNode;
	/** Extra content rendered inline after the title text (e.g. badge) */
	badge?: ReactNode;
	as?: "h1" | "h2";
};

export default function SectionHeader({
	title,
	subtitle,
	trailing,
	badge,
	as: Tag = "h2",
}: SectionHeaderProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
			<div>
				<div className="flex items-center gap-3 mb-1">
					<Tag className="section-heading accent-underline">{title}</Tag>
					{badge}
				</div>
				{subtitle && <p className="section-subtitle">{subtitle}</p>}
			</div>
			{trailing}
		</div>
	);
}
