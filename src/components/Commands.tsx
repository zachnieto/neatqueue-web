import { Link } from "react-router-dom";
import fileIcon from "../assets/file-icon.svg";
import type { CommandSectonData } from "../types";

const command_sections: CommandSectonData[] = [
	{
		title: "Create a Queue",
		paragraph:
			"Once a queue is created, players will be able to freely start matches at their own will. To start a queue, there are a few options:\n\nYou can use the `/startqueue` command, which will have 3 parameters for a basic queue setup: queuename, team size, and number of teams.\n\nAnother command you can use is /setup, which will start an interactive walkthrough to setup your queue.\n\nNeatQueue also supports configuration sharing. You can load up a specific config using `/config load`, and save your config with `/config save`",
		link: "https://docs.neatqueue.com/#/?id=starting-a-queue",
	},
	{
		title: "Leaderboard",
		paragraph:
			"To display the leaderboard of your queue, you can run `/leaderboard`. The leaderboard will show MMRs, wins, win rates, and much more!\nYou can also configure a custom URL with `/leaderboardconfig url` which will generate an online leaderboard.\n\nNote: To share a leaderboard with many queues, you can either enable `/leaderboardconfig sharedstats serverwide`, set up a common `/leaderboard sharedstats`, or just name all the queues the same via `/queuename`.\nAlso, click the leaderboard title to see the web version!",
		link: "https://docs.neatqueue.com/#/?id=leaderboard",
	},
	{
		title: "Sharing Stats Between Queues",
		paragraph:
			"By design, player stats are stored using the queue name. This means that any queues that have the same name will share the same underlying stats system. You can change an existing queue's name with /queuename.\n\nYou can override the underlying stat system name using `/leaderboardconfig sharedstats`, which will let queues with different names have the same stats.",
		link: "https://docs.neatqueue.com/#/?id=queue-name",
	},
	{
		title: "MMR Change",
		paragraph:
			"With `/mmr change set` you can adjust the average MMR change for wins and losses.\nYou can also set the loser MMR change that overrides the average MMR change for losses, and if you want those values to be always the same, you can set the static parameter to true.\n\nNote: There are many more customization options for the MMR, which can be found in the documentation.",
		link: "https://docs.neatqueue.com/#/?id=mmr-change",
	},
	{
		title: "Ranks/Auto Roles",
		paragraph:
			"Reward your players by setting up ranks via `/autoroles` based on MMR, wins, games played, and others! These ranks will automatically be assigned when players are within the defined threshold.",
		link: "https://docs.neatqueue.com/#/?id=ranksautomatically-assign-discord-roles",
	},
	{
		title: "Starting MMR",
		paragraph:
			"Set a starting MMR value with `/startingmmr set` for a given role.\nYou can omit the role to set the starting MMR for all users in the queue.",
		link: "https://docs.neatqueue.com/#/?id=starting-mmr",
	},
	{
		title: "Maps and Gamemodes",
		paragraph:
			"Set the maps and gamemodes to be played with `/map add`.\nYou can also set the selection method with `/map selection`.",
		link: "https://docs.neatqueue.com/#/?id=maps",
	},
	{
		title: "Team Selection",
		paragraph:
			"Set the team selection method with /teamselection.\nChoose between 5 different methods, and select the ones you want to keep.",
		link: "https://docs.neatqueue.com/#/?id=teamselection",
	},
	{
		title: "Captain Selection",
		paragraph:
			"Set the captain selection method with `/captains selection`.\nChoose between 5 different methods, and select the ones you want to keep.",
		link: "https://docs.neatqueue.com/#/?id=captain-selection",
	},
	{
		title: "Lobby Channel",
		paragraph:
			"Set a lobby channel for your queue with `/lobbychannel set`.\nPlayers will be moved to and from between games.",
		link: "https://docs.neatqueue.com/#/?id=lobby-channel",
	},
	{
		title: "Cancel",
		paragraph: "Call a vote to cancel a running game with `/cancel`.",
		link: "https://docs.neatqueue.com/#/?id=cancel",
	},
	{
		title: "End Queue",
		paragraph:
			"End a running queue with /endqueue. This will end the queue, and generate a code to be used to start the queue again with `/config load`. The same settings and data will be loaded.\nIf you want to delete the stats completely, use the `/managestats resetstats` all command.",
		link: "https://docs.neatqueue.com/#/?id=end-queue",
	},
];

const regex = /(`\/[^`]+`|\/\w+)/g;

const formatCommand = (cmd: string) => {
	if (cmd.includes("`")) {
		return cmd.slice(1, -1);
	}
	return cmd;
};

const wrapCommandsInCodeTags = (text: string) => {
	return text.replace(regex, (match) => `<code>${formatCommand(match)}</code>`);
};

const Commands = () => {
	return (
		<div>
			{command_sections.map((section) => (
				<div className="flex gap-[50px] mt-[50px] md:mb-[100px] flex-col md:flex-row">
					<div className="flex-1 flex flex-col gap-5 justify-center">
						<h1 className="text-4xl font-semibold">{section.title}</h1>
						<p
							className="whitespace-pre-line"
							dangerouslySetInnerHTML={{
								__html: wrapCommandsInCodeTags(section.paragraph),
							}}
						/>
						<Link to={section.link} className="w-fit">
							<button className="flex items-center p-3 cursor-pointer bg-red-700 border-none rounded w-max text-white hover:bg-red-800 transition ease-out duration-300">
								See on Documentation
								<img
									src={fileIcon}
									width={15}
									height={15}
									className="ml-2"
									alt="file-icon"
								/>
							</button>
						</Link>
					</div>
					<div className="flex flex-1 flex-col justify-center items-center gap-6">
						{[...new Set(section.paragraph.match(regex))].map((match: any) => {
							return (
								<button className="flex items-center p-3 cursor-auto bg-[#2b2d31] border-solid rounded w-max text-white border-l-4 border-gray-500">
									{formatCommand(match)}
								</button>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
};

export default Commands;
