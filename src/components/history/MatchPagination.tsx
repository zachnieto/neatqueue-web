import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../util/tailwind";

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
		<div className="mt-6">
			<div className="bg-neutral-800 rounded-xl border border-neutral-700 px-6 py-4 shadow-2xl">
				<div className="flex items-center justify-between flex-wrap gap-4">
					<div className="text-sm text-gray-400">
						Page <span className="text-white font-semibold">{currentPage}</span>{" "}
						of <span className="text-white font-semibold">{totalPages}</span>
					</div>

					<div className="flex items-center space-x-2">
						<button
							type="button"
							onClick={() => onPageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className={classNames(
								"px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1",
								currentPage === 1
									? "bg-neutral-800 text-gray-500 cursor-not-allowed"
									: "bg-neutral-700 hover:bg-neutral-600 text-white shadow-lg",
							)}
						>
							<ChevronLeftIcon className="h-4 w-4" />
							Previous
						</button>

						<button
							type="button"
							onClick={() => onPageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className={classNames(
								"px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1",
								currentPage === totalPages
									? "bg-neutral-800 text-gray-500 cursor-not-allowed"
									: "bg-neutral-700 hover:bg-neutral-600 text-white shadow-lg",
							)}
						>
							Next
							<ChevronRightIcon className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
