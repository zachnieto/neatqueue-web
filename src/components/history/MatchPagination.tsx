import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface MatchPaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export const MatchPagination = ({
	currentPage,
	totalPages,
	onPageChange,
}: MatchPaginationProps) => {
	if (totalPages <= 1) {
		return null;
	}

	return (
		<div style={{ marginTop: 24 }}>
			<div
				className="card-glass"
				style={{
					padding: "16px 24px",
					border: "1px solid rgba(255,255,255,0.07)",
					borderRadius: 2,
				}}
			>
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div className="section-subtitle" style={{ marginTop: 0 }}>
						Page{" "}
						<span
							className="font-mono-gaming"
							style={{ color: "#e8eaf0", fontWeight: 600 }}
						>
							{currentPage}
						</span>{" "}
						of{" "}
						<span
							className="font-mono-gaming"
							style={{ color: "#e8eaf0", fontWeight: 600 }}
						>
							{totalPages}
						</span>
					</div>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => onPageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="btn-action"
							style={{ padding: "6px 14px" }}
						>
							<ChevronLeftIcon className="h-4 w-4" />
							PREVIOUS
						</button>

						<button
							type="button"
							onClick={() => onPageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="btn-action"
							style={{ padding: "6px 14px" }}
						>
							NEXT
							<ChevronRightIcon className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
