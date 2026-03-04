import type { ReactNode } from "react";

type PageLayoutProps = {
	children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
	return (
		<div className="page-wrapper">
			<main className="page-main">{children}</main>
		</div>
	);
}
