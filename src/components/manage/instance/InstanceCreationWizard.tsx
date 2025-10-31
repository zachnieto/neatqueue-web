import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import type { InstancePricing } from "../../../types";
import { classNames } from "../../../util/tailwind";
import Wizard, { type WizardStep } from "../../Wizard";

type InstanceCreationWizardProps = {
	visible: boolean;
	setVisibility: (visibility: boolean) => void;
	instanceTypes: InstancePricing[];
	onComplete: (
		selectedInstance: InstancePricing,
		botToken: string,
	) => Promise<void>;
	onOpenBotGuide: () => void;
};

const InstanceCreationWizard = ({
	visible,
	setVisibility,
	instanceTypes,
	onComplete,
	onOpenBotGuide,
}: InstanceCreationWizardProps) => {
	const { showToast } = useToast();
	const [selectedInstance, setSelectedInstance] =
		useState<InstancePricing | null>(instanceTypes[0] || null);
	const [botToken, setBotToken] = useState<string>("");

	const multipleInstanceOptions = instanceTypes.length > 1;

	useEffect(() => {
		setSelectedInstance(instanceTypes[0] || null);
	}, [instanceTypes]);

	const handleComplete = async () => {
		if (!selectedInstance || !botToken) {
			showToast("Incomplete", {
				message: "Please complete all steps",
				variant: "error",
			});
			return;
		}

		await onComplete(selectedInstance, botToken);
		// Reset state
		setSelectedInstance(null);
		setBotToken("");
	};

	const handleCancel = () => {
		// Reset state when canceling
		setSelectedInstance(null);
		setBotToken("");
	};

	const steps: WizardStep[] = [
		{
			title: "Private Instance Setup",
			shortLabel: "Overview",
			content: (
				<div className="space-y-4">
					<p className="text-lg">
						Create your own private NeatQueue instance with your own Discord
						bot!
					</p>
					<div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
						<h3 className="mb-2">What you'll need:</h3>
						<ul className="list-disc list-inside space-y-1 text-sm">
							<li>A Discord bot token (we'll help you create one)</li>
							<li>Credits to purchase the instance</li>
						</ul>
					</div>
					<div className="bg-neutral-800/50 border-l-4 border-neutral-600 p-4 rounded">
						<h3 className="mb-2">Benefits of Private Instances:</h3>
						<ul className="list-disc list-inside space-y-1 text-sm">
							<li>Dedicated resources for your server</li>
							<li>Custom bot identity (name, avatar, status)</li>
						</ul>
					</div>
				</div>
			),
		},
		{
			title: "Select Instance Size",
			shortLabel: "Size",
			hidden: !multipleInstanceOptions,
			content: (
				<div className="space-y-4">
					<p className="text-lg mb-4">
						Choose the instance size that best fits your server's needs:
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{instanceTypes.map((instance: InstancePricing, i: number) => (
							<button
								type="button"
								key={i}
								onClick={() => setSelectedInstance(instance)}
								className={classNames(
									"p-6 rounded-lg border-2 transition-all text-left",
									selectedInstance?.name === instance.name
										? "border-neutral-500 bg-neutral-800/50 shadow-lg"
										: "border-stone-700 bg-black/25 hover:border-neutral-500/50",
								)}
							>
								<div className="flex items-start justify-between mb-3">
									<h3 className="text-2xl">{instance.name}</h3>
									<div
										className={classNames(
											"w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
											selectedInstance?.name === instance.name
												? "border-neutral-400 bg-neutral-400"
												: "border-stone-600",
										)}
									>
										{selectedInstance?.name === instance.name && (
											<svg
												className="w-4 h-4 text-white"
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
										)}
									</div>
								</div>
								<p className="text-sm text-gray-300 mb-4">
									{instance.description}
								</p>
								<div className="flex items-baseline">
									<span className="text-3xl text-white">{instance.price}</span>
									<span className="text-sm text-gray-400 ml-2">
										credits / 30 days
									</span>
								</div>
							</button>
						))}
					</div>
					{selectedInstance && (
						<div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded mt-4">
							<p className="text-sm">
								<strong>✓ Selected:</strong> {selectedInstance.name} -{" "}
								{selectedInstance.description}
							</p>
						</div>
					)}
				</div>
			),
			validate: () => {
				if (!selectedInstance) {
					showToast("Instance Size Required", {
						message: "Please select an instance size to continue",
						variant: "error",
					});
					return false;
				}
				return true;
			},
		},
		{
			title: "Enter Bot Token",
			shortLabel: "Token",
			content: (
				<div className="space-y-4">
					<p className="text-lg">
						Enter your Discord bot token. If you don't have one yet, we can help
						you create it!
					</p>

					<div className="space-y-3">
						<label className="block">
							<span className="text-lg mb-2 block">Bot Token:</span>
							<input
								type="password"
								value={botToken}
								onChange={(e) => {
									setBotToken(e.target.value);
								}}
								placeholder="Paste your bot token here"
								className="w-full px-4 py-3 rounded-lg bg-stone-800 border border-stone-700 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 transition-all text-white"
							/>
						</label>

						<button
							type="button"
							onClick={onOpenBotGuide}
							className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								/>
							</svg>
							How to Get a Bot Token
						</button>
					</div>

					<div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded">
						<p className="text-sm">
							<strong>🔒 Security:</strong> Your bot token is stored securely
							and encrypted. Never share your token with anyone outside of this
							platform.
						</p>
					</div>
				</div>
			),
			validate: () => {
				if (!botToken || botToken.trim().length === 0) {
					showToast("Bot Token Required", {
						message: "Please enter your Discord bot token to continue",
						variant: "error",
					});
					return false;
				}
				if (botToken.length < 50) {
					showToast("Invalid Bot Token", {
						message:
							"Bot token appears to be too short. Please check and try again.",
						variant: "error",
					});
					return false;
				}
				return true;
			},
		},
		{
			title: "Review and Confirm",
			shortLabel: "Review",
			content: (
				<div className="space-y-4">
					<p className="text-lg">
						Please review your instance configuration before confirming:
					</p>

					<div className="bg-stone-800 rounded-lg p-6 space-y-4">
						{multipleInstanceOptions && (
							<div className="border-b border-stone-700 pb-4">
								<h3 className="text-sm text-gray-400 mb-1">Instance Size</h3>
								<p className="text-xl text-white">{selectedInstance?.name}</p>
								<p className="text-sm text-gray-300">
									{selectedInstance?.description}
								</p>
							</div>
						)}

						<div className="border-b border-stone-700 pb-4">
							<h3 className="text-sm text-gray-400 mb-1">Cost</h3>
							<p className="text-2xl">
								{selectedInstance?.price}{" "}
								<span className="text-lg text-gray-400">credits / 30 days</span>
							</p>
						</div>

						<div>
							<h3 className="text-sm text-gray-400 mb-1">Bot Token</h3>
							<p className="text-sm font-mono text-gray-300">
								{botToken.length > 20
									? `${botToken.substring(0, 15)}...${botToken.substring(botToken.length - 15)}`
									: "***"}
							</p>
						</div>
					</div>

					<div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
						<h3 className="mb-2">What happens next?</h3>
						<ol className="list-decimal list-inside space-y-1 text-sm">
							<li>Your credits will be deducted</li>
							<li>
								Your instance will be created (this may take a few minutes)
							</li>
							<li>Your bot will come online and be ready to use</li>
							<li>You can manage your instance from this dashboard</li>
						</ol>
					</div>

					<div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded">
						<p className="text-sm">
							<strong>✓ Ready to proceed</strong> - Click "Create Instance" to
							finalize your purchase.
						</p>
					</div>
				</div>
			),
		},
	];

	return (
		<>
			<Wizard
				visible={visible}
				setVisibility={setVisibility}
				steps={steps}
				title="Create Private Instance"
				completeBtnText="Create Instance"
				onComplete={handleComplete}
				onCancel={handleCancel}
				allowStepNavigation={true}
			/>
		</>
	);
};

export default InstanceCreationWizard;
