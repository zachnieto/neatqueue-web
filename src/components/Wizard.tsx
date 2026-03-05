import { type ReactNode, useState } from "react";
import { classNames } from "../util/tailwind";

export type WizardStep = {
	title: string;
	content: ReactNode;
	shortLabel?: string; // Optional short label for step indicator (e.g., "Intro", "Select")
	canSkip?: boolean; // Whether this step can be skipped
	validate?: () => boolean | Promise<boolean>; // Optional validation before proceeding
	onEnter?: () => void | Promise<void>; // Called when entering this step
	onExit?: () => void | Promise<void>; // Called when leaving this step
	hidden?: boolean; // Whether this step is hidden
};

type WizardProps = {
	visible: boolean;
	setVisibility: (visibility: boolean) => void;
	steps: WizardStep[];
	title: string;
	onComplete?: () => void | Promise<void>; // Called when wizard is completed
	onCancel?: () => void | Promise<void>; // Called when wizard is cancelled
	completeBtnText?: string; // Text for the final step button (default: "Complete")
	allowStepNavigation?: boolean; // Whether users can click step indicators to jump (default: true)
	showProgress?: boolean; // Whether to show progress bar (default: true)
	width?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "full"; // Modal width (default: "4xl")
};

const Wizard = ({
	visible,
	setVisibility,
	steps,
	title,
	onComplete,
	onCancel,
	completeBtnText = "Complete",
	allowStepNavigation: _allowStepNavigation = true,
	showProgress = true,
	width = "4xl",
}: WizardProps) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [isProcessing, setIsProcessing] = useState(false);

	const displayedSteps = steps.filter((step) => !step.hidden);
	const currentStepData = displayedSteps[currentStep];

	const widthClasses = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
		"2xl": "max-w-2xl",
		"4xl": "max-w-4xl",
		full: "max-w-full",
	};

	const handleClose = async () => {
		if (onCancel) {
			await onCancel();
		}
		setVisibility(false);
		setCurrentStep(0);
	};

	const handleStepChange = async (newStep: number) => {
		if (isProcessing) return;

		// Allow going back to previous steps or advancing to the immediate next step
		// But prevent skipping multiple steps ahead
		if (newStep > currentStep + 1) return;

		// If advancing forward, validate current step first
		if (newStep > currentStep) {
			if (currentStepData.validate) {
				setIsProcessing(true);
				try {
					const isValid = await currentStepData.validate();
					if (!isValid) {
						setIsProcessing(false);
						return;
					}
				} catch (error) {
					console.error("Validation error:", error);
					setIsProcessing(false);
					return;
				}
				setIsProcessing(false);
			}
		}

		// Call onExit for current step
		if (currentStepData.onExit) {
			setIsProcessing(true);
			try {
				await currentStepData.onExit();
			} catch (error) {
				console.error("Error in onExit:", error);
				setIsProcessing(false);
				return;
			}
			setIsProcessing(false);
		}

		setCurrentStep(newStep);

		// Call onEnter for new step
		const newStepData = displayedSteps[newStep];
		if (newStepData.onEnter) {
			setIsProcessing(true);
			try {
				await newStepData.onEnter();
			} finally {
				setIsProcessing(false);
			}
		}
	};

	const handleNext = async () => {
		if (isProcessing) return;
		if (currentStep < displayedSteps.length - 1) {
			await handleStepChange(currentStep + 1);
		}
	};

	const handlePrevious = async () => {
		if (currentStep > 0 && !isProcessing) {
			await handleStepChange(currentStep - 1);
		}
	};

	const handleComplete = async () => {
		if (isProcessing) return;

		// Validate final step
		if (currentStepData.validate) {
			setIsProcessing(true);
			try {
				const isValid = await currentStepData.validate();
				if (!isValid) {
					setIsProcessing(false);
					return;
				}
			} catch (error) {
				console.error("Validation error:", error);
				setIsProcessing(false);
				return;
			}
		}

		// Call onComplete
		if (onComplete) {
			setIsProcessing(true);
			try {
				await onComplete();
			} catch (error) {
				console.error("Error in onComplete:", error);
				setIsProcessing(false);
				return;
			}
			setIsProcessing(false);
		}

		setVisibility(false);
		setCurrentStep(0);
	};

	if (!visible) return null;

	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
				<div
					className={`relative w-full ${widthClasses[width]} my-6 mx-auto px-4 modal-enter`}
				>
					<div
						className="card-glass panel"
						style={{
							padding: 0,
							borderRadius: "6px",
							background: "rgba(24,24,28,0.95)",
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
							}}
						>
							<h3 className="panel-title" style={{ margin: 0 }}>
								{title}
							</h3>
							<button
								type="button"
								onClick={handleClose}
								disabled={isProcessing}
								style={{
									background: "none",
									border: "none",
									cursor: isProcessing ? "not-allowed" : "pointer",
									color: "#5a6078",
									transition: "color 0.2s",
									padding: 4,
									opacity: isProcessing ? 0.5 : 1,
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

						{/* Progress Bar */}
						{showProgress && (
							<div style={{ padding: "16px 24px 0" }}>
								<div className="flex justify-between items-center mb-2">
									<span className="section-subtitle" style={{ marginTop: 0 }}>
										Step {currentStep + 1} of {displayedSteps.length}
									</span>
									<span className="section-subtitle" style={{ marginTop: 0 }}>
										{Math.round(
											((currentStep + 1) / displayedSteps.length) * 100,
										)}
										% Complete
									</span>
								</div>
								<div
									style={{
										width: "100%",
										background: "rgba(255,255,255,0.05)",
										borderRadius: "9999px",
										height: "4px",
									}}
								>
									<div
										style={{
											height: "4px",
											borderRadius: "9999px",
											background:
												"linear-gradient(90deg, rgba(0,180,255,0.7), rgba(0,180,255,0.3))",
											transition: "width 0.3s ease",
											width: `${((currentStep + 1) / displayedSteps.length) * 100}%`,
										}}
									/>
								</div>
							</div>
						)}

						{/* Step Indicators */}
						<div style={{ padding: "20px 24px 8px" }}>
							<div className="flex justify-between">
								{displayedSteps.map((step, index) => {
									const shortLabel =
										step.shortLabel ||
										(index === 0
											? "Start"
											: index === displayedSteps.length - 1
												? "Finish"
												: `Step ${index}`);

									return (
										<button
											type="button"
											key={step.title}
											onClick={() => {
												if (index < currentStep || index === currentStep + 1) {
													handleStepChange(index);
												}
											}}
											disabled={isProcessing || index > currentStep + 1}
											className={classNames(
												"flex flex-col items-center space-y-2 transition-all",
												index < currentStep
													? "opacity-100 cursor-pointer hover:opacity-90"
													: index === currentStep
														? "opacity-100 cursor-default"
														: index === currentStep + 1
															? "opacity-80 cursor-pointer hover:opacity-100"
															: "opacity-40 cursor-not-allowed",
												isProcessing ? "pointer-events-none" : "",
											)}
										>
											<div
												className={classNames(
													"w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all",
													index < currentStep
														? "text-white"
														: index === currentStep
															? "text-white"
															: "",
												)}
												style={{
													background:
														index < currentStep
															? "rgba(57,217,138,0.25)"
															: index === currentStep
																? "rgba(0,180,255,0.25)"
																: "rgba(255,255,255,0.05)",
													border:
														index < currentStep
															? "1px solid rgba(57,217,138,0.4)"
															: index === currentStep
																? "1px solid rgba(0,180,255,0.4)"
																: "1px solid rgba(255,255,255,0.08)",
													color:
														index < currentStep
															? "#39d98a"
															: index === currentStep
																? "#00b4ff"
																: "#5a6078",
												}}
											>
												{index < currentStep ? (
													<svg
														className="w-6 h-6"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														aria-hidden
													>
														<title>Complete</title>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={3}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												) : (
													index + 1
												)}
											</div>
											<span
												className="text-xs text-center max-w-20 hidden sm:block font-inter"
												style={{ color: "#5a6078" }}
											>
												{shortLabel}
											</span>
										</button>
									);
								})}
							</div>
						</div>

						{/* Content */}
						<div
							style={{ padding: "24px", overflow: "auto", maxHeight: "24rem" }}
						>
							<div style={{ marginBottom: "16px" }}>
								<h2
									className="font-rajdhani"
									style={{
										fontSize: "20px",
										fontWeight: 700,
										color: "#e8eaf0",
										letterSpacing: "0.04em",
										marginBottom: "16px",
									}}
								>
									{displayedSteps[currentStep].title}
								</h2>
								{displayedSteps[currentStep].content}
							</div>
						</div>

						{/* Footer */}
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								padding: "16px 24px 20px",
								borderTop: "1px solid rgba(255,255,255,0.06)",
							}}
						>
							<button
								type="button"
								className={classNames(
									"btn-action",
									currentStep === 0 ? "invisible" : "",
								)}
								onClick={handlePrevious}
								disabled={currentStep === 0 || isProcessing}
							>
								← PREVIOUS
							</button>

							<div className="flex gap-3">
								<button
									type="button"
									className="btn-action btn-action-danger"
									onClick={handleClose}
									disabled={isProcessing}
								>
									CANCEL
								</button>

								{currentStep < displayedSteps.length - 1 ? (
									<button
										type="button"
										className="btn-action btn-join"
										onClick={handleNext}
										disabled={isProcessing}
									>
										{isProcessing ? "PROCESSING…" : "NEXT →"}
									</button>
								) : (
									<button
										type="button"
										className="btn-action btn-action-green btn-join"
										onClick={handleComplete}
										disabled={isProcessing}
									>
										{isProcessing
											? "PROCESSING…"
											: `✓ ${completeBtnText.toUpperCase()}`}
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="opacity-60 fixed inset-0 z-40 bg-black" />
		</>
	);
};

export default Wizard;
