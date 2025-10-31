const Privacy = () => {
	return (
		<div className="flex justify-center items-center h-screen flex-col gap-3">
			<h1 className="text-6xl">Privacy Policy</h1>
			<h2 className="text-xl">
				By using the NeatQueue website and Discord bot, you agree that you have
				read and agree to this policy. This policy is subject to change at any
				time.
			</h2>

			<h1 className="text-3xl">Information we collect</h1>
			<ul className="list-disc text-xl">
				<li>Discord usernames</li>
				<li>Discord IDs</li>
				<li>Recent Discord interactions</li>
				<li>Match data</li>
				<ul className="list-disc ml-10">
					<li>Wins/Losses/MMR/Streak</li>
					<li>Matchups vs other players</li>
				</ul>
				<li>Server IDs</li>
				<li>Queue channel IDs</li>
				<li>Leaderboard message IDs</li>
				<li>Command usage</li>
				<li>Message Content in match channels</li>
			</ul>

			<h1 className="text-3xl">Data Removal</h1>
			<ul className="list-disc text-xl">
				<li>
					Server-specific player stats are able to be deleted via{" "}
					<code>/resetstats</code>
				</li>
				<li>
					Reach out via the support server to request deletion of other data
				</li>
			</ul>
		</div>
	);
};
export default Privacy;
