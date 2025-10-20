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
	allowStepNavigation = true,
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
					className={`relative w-full ${widthClasses[width]} my-6 mx-auto px-4`}
				>
					<div className="rounded-lg shadow-2xl relative flex flex-col w-full bg-stone-900 outline-none focus:outline-none border border-neutral-700">
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-neutral-700">
							<h3 className="text-3xl text-white">{title}</h3>
							<button
								className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
								onClick={handleClose}
								disabled={isProcessing}
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
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
							<div className="px-6 pt-4">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm text-gray-400">
										Step {currentStep + 1} of {displayedSteps.length}
									</span>
									<span className="text-sm text-gray-400">
										{Math.round(((currentStep + 1) / displayedSteps.length) * 100)}%
										Complete
									</span>
								</div>
								<div className="w-full bg-stone-800 rounded-full h-2">
									<div
										className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
										style={{
											width: `${((currentStep + 1) / displayedSteps.length) * 100}%`,
										}}
									/>
								</div>
							</div>
						)}

						{/* Step Indicators */}
						<div className="px-6 pt-6 pb-2">
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
											key={index}
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
														? "bg-green-600 text-white"
														: index === currentStep
															? "bg-violet-600 text-white ring-4 ring-violet-500/30"
															: "bg-stone-700 text-gray-400",
												)}
											>
												{index < currentStep ? (
													<svg
														className="w-6 h-6"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
													>
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
											<span className="text-xs text-center max-w-20 hidden sm:block">
												{shortLabel}
											</span>
										</button>
									);
								})}
							</div>
						</div>

						{/* Content */}
						<div className="relative p-8 flex-auto overflow-y-auto max-h-96">
							<div className="mb-6">
								<h2 className="text-2xl mb-4 text-white">
									{displayedSteps[currentStep].title}
								</h2>
								{displayedSteps[currentStep].content}
							</div>
						</div>

						{/* Footer */}
						<div className="flex items-center justify-between p-6 border-t border-neutral-700">
							<button
								className={classNames(
									"px-6 py-2 rounded-md font-medium transition-all",
									currentStep === 0
										? "invisible"
										: "bg-stone-800 text-white hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed",
								)}
								onClick={handlePrevious}
								disabled={currentStep === 0 || isProcessing}
							>
								← Previous
							</button>

							<div className="flex gap-3">
								<button
									className="text-gray-400 hover:text-white px-6 py-2 rounded-md font-medium transition-all disabled:opacity-50"
									onClick={handleClose}
									disabled={isProcessing}
								>
									Cancel
								</button>

								{currentStep < displayedSteps.length - 1 ? (
									<button
										className="bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
										onClick={handleNext}
										disabled={isProcessing}
									>
										{isProcessing ? "Processing..." : "Next →"}
									</button>
								) : (
									<button
										className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
										onClick={handleComplete}
										disabled={isProcessing}
									>
										{isProcessing ? "Processing..." : `✓ ${completeBtnText}`}
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
