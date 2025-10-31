const Features = () => {
	const features = [
		{
			title: "Multiple Team Selection Modes",
			details: "Balanced, Captains, Random, Player's Choose, and Unfair",
		},
	];

	return (
		<div className="flex justify-center items-center">
			<h1 className="text-2xl mb-4 max-w-xl">
				Turn your server into competitive matchmaking, or a friendly gaming
				environment. 100+ commands for endless possibilities.
			</h1>
			<div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{features.map((feature, index) => (
						<div
							key={index}
							className="max-w-sm rounded overflow-hidden shadow-lg bg-black/25 text-white text-center p-4"
						>
							<h2 className="font-bold text-xl mb-2">{feature.title}</h2>
							<p className="">{feature.details}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Features;
