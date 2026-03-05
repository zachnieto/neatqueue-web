import type { ReactElement } from "react";

export default function Modal({
	visible,
	setVisibility,
	onSubmit,
	title,
	component,
	submitText,
	className,
}: {
	onSubmit?: (...args: unknown[]) => Promise<void>;
	setVisibility: (visibility: boolean) => void;
	title: string;
	submitText: string;
	component?: ReactElement;
	visible: boolean;
	className?: string;
}) {
	if (!visible) return null;

	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
				<div
					className={`relative w-full ${className || "max-w-lg"} my-6 mx-auto px-4 modal-enter`}
				>
					<div
						className="card-glass panel"
						style={{
							padding: 0,
							borderRadius: "6px",
							background: "rgba(24,24,28,0.95)",
							maxHeight: "90vh",
							display: "flex",
							flexDirection: "column",
						}}
					>
						<div className="panel-accent" />

						{/* Header */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "20px 24px 16px",
								borderBottom: "1px solid rgba(255,255,255,0.06)",
								flexShrink: 0,
							}}
						>
							<h3 className="panel-title" style={{ margin: 0 }}>
								{title}
							</h3>
							<button
								type="button"
								onClick={() => setVisibility(false)}
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									color: "#5a6078",
									transition: "color 0.2s",
									padding: 4,
								}}
								onMouseEnter={(e) => (e.currentTarget.style.color = "#e8eaf0")}
								onMouseLeave={(e) => (e.currentTarget.style.color = "#5a6078")}
							>
								<svg
									width="18"
									height="18"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden
								>
									<title>Close</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						{/* Body */}
						<div
							style={{
								padding: "20px 24px",
								overflowY: "auto",
								flex: 1,
								minHeight: 0,
							}}
						>
							{component}
						</div>

						{/* Footer */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-end",
								gap: 10,
								padding: "16px 24px 20px",
								borderTop: "1px solid rgba(255,255,255,0.06)",
							}}
						>
							<button
								type="button"
								className="btn-action btn-action-danger"
								onClick={() => setVisibility(false)}
							>
								CLOSE
							</button>

							{onSubmit && (
								<button
									type="button"
									className="btn-action btn-action-green btn-join"
									onClick={() => {
										setVisibility(false);
										onSubmit();
									}}
								>
									{submitText.toUpperCase()}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-60 fixed inset-0 z-40 bg-black" />
		</>
	);
}
