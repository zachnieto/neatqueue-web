interface SkeletonProps {
	className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => {
	return (
		<div
			className={`animate-pulse rounded bg-white/20 ${className}`.trim()}
			aria-hidden
		/>
	);
};

export default Skeleton;
