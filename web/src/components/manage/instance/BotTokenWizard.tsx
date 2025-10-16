import Wizard, { type WizardStep } from "../../Wizard";

const BotTokenWizard = ({
	visible,
	setVisibility,
}: {
	visible: boolean;
	setVisibility: (visibility: boolean) => void;
}) => {
	const steps: WizardStep[] = [
		{
			title: "Creating a Bot Account",
			shortLabel: "Intro",
			content: (
				<div className="space-y-4">
					<p className="text-lg">
						To use a private instance, you need to create your own Discord bot
						and provide its token. Don't worry - it's easier than you think!
					</p>
					<div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
						<p className="text-sm">
							<strong>Note:</strong> You must be logged into the Discord website
							for the following steps to work.
						</p>
					</div>
				</div>
			),
		},
		{
			title: "Step 1: Create an Application",
			shortLabel: "Create App",
			content: (
				<div className="space-y-4">
					<ol className="list-decimal list-inside space-y-3 text-lg">
						<li>
							Navigate to the{" "}
							<a
								href="https://discord.com/developers/applications"
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-400 hover:text-blue-300 underline"
							>
								Discord Developer Portal
							</a>
						</li>
						<li>Click on the "New Application" button</li>
						<li>
							Give your application a name (e.g., "My NeatQueue Bot") and click
							"Create"
						</li>
					</ol>
					<div className="bg-stone-800 p-4 rounded-lg mt-4">
						<p className="text-sm text-gray-300">
							💡 <strong>Tip:</strong> You can name your bot anything you want.
							This name will be visible when the bot joins servers.
						</p>
					</div>
				</div>
			),
		},
		{
			title: "Step 2: Configure the Bot",
			shortLabel: "Configure",
			content: (
				<div className="space-y-4">
					<ol className="list-decimal list-inside space-y-3 text-lg">
						<li>In your application, navigate to the "Bot" tab on the left</li>
                        <li>(Optional) Customize the bot's username and avatar</li>
						<li>
							Scroll down to the "Privileged Gateway Intents" section and enable
							the following:
							<ul className="list-disc list-inside space-y-1 ml-6 mt-2">
								<li>
									<strong>Server Members Intent</strong>
								</li>
								<li>
									<strong>Message Content Intent</strong>
								</li>
							</ul>
						</li>
						<li>Click "Save Changes" at the bottom of the page</li>
					</ol>
					<div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded mt-4">
						<p className="text-sm">
							<strong>⚠️ Required:</strong> NeatQueue requires these intents to
							function properly. Make sure all three are enabled!
						</p>
					</div>
				</div>
			),
		},
        
		{
			title: "Step 3: Set Bot Permissions",
			shortLabel: "Permissions",
			content: (
				<div className="space-y-4">
					<p className="text-lg">
						Configure the bot's installation settings and permissions:
					</p>
					<ol className="list-decimal list-inside space-y-3 text-lg">
						<li>Navigate to the <strong>Installation</strong> tab</li>
						<li>
							Under "Installation Contexts", select{" "}
							<strong>Guild Install</strong>
						</li>
						<li>
							Under "Install Link", select the <strong>Discord Provided Link</strong>{" "}
							option
						</li>
						<li>
							Under "Default Install Settings", for scopes select:
							<ul className="list-disc list-inside ml-6 mt-2 space-y-1">
								<li>
									<strong>applications.commands</strong>
								</li>
								<li>
									<strong>bot</strong>
								</li>
							</ul>
						</li>
						<li>
							Under "Permissions", select the following:
							<ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-base">
								<li>Create Private Threads</li>
								<li>Create Public Threads</li>
								<li>Manage Channels</li>
								<li>Manage Messages</li>
								<li>Manage Nicknames</li>
								<li>Manage Roles</li>
								<li>Manage Threads</li>
								<li>Manage Webhooks</li>
								<li>Move Members</li>
								<li>Read Message History</li>
								<li>Send Messages</li>
							</ul>
						</li>
						<li>Click "Save Changes" at the bottom</li>
						<li>
							Copy the Install Link and open it in your browser to invite the bot
							to your server
						</li>
					</ol>
					<div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded mt-4">
						<p className="text-sm">
							<strong>✅ Almost Done!</strong> Once your bot is in your server
							and you've entered the token in NeatQueue, your private instance
							will be ready to use!
						</p>
					</div>
				</div>
			),
		},
		{
			title: "Step 4: Copy Your Bot Token",
			shortLabel: "Token",
			content: (
				<div className="space-y-4">
					<ol className="list-decimal list-inside space-y-3 text-lg">
						<li>
							In the "Bot" tab, under the bot's username, find the "Token"
							section and click "Reset Token" (or "Copy" if you see it)
						</li>
						<li>Copy the token that appears</li>
						<li>Paste it into the "Bot Token" field in NeatQueue</li>
					</ol>
					<div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded mt-4">
						<p className="text-sm">
							<strong>🔒 Security Warning:</strong> Your bot token is like a
							password. Never share it with anyone or post it publicly! If your
							token is leaked, anyone can control your bot. If this happens,
							immediately reset the token in the Discord Developer Portal.
						</p>
					</div>
				</div>
			),
		},
	];

	return (
		<Wizard
			visible={visible}
			setVisibility={setVisibility}
			steps={steps}
			title="Discord Bot Setup Guide"
			completeBtnText="Done"
		/>
	);
};

export default BotTokenWizard;

