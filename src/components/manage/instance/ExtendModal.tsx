const ExtendModal = ({ price }: { price: number }) => {
	return (
		<div>
			<h1 className="text-xl max-w-md">
				The instance will be extended for 30 days at the price of {price}{" "}
				credits
			</h1>
		</div>
	);
};

export default ExtendModal;
