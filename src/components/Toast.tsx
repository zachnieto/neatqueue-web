import { useCallback, useEffect, useRef, useState } from "react";
import type { Toast as ToastType } from "../hooks/useToast";
import { classNames } from "../util/tailwind";

const variantStyles = {
	success: {
		container: "bg-green-900/90 border-green-500",
		icon: "✓",
		iconBg: "bg-green-600",
	},
	error: {
		container: "bg-red-900/90 border-red-500",
		icon: "✕",
		iconBg: "bg-red-600",
	},
	warning: {
		container: "bg-yellow-900/90 border-yellow-500",
		icon: "⚠",
		iconBg: "bg-yellow-600",
	},
	info: {
		container: "bg-blue-900/90 border-blue-500",
		icon: "ℹ",
		iconBg: "bg-blue-600",
	},
};

type ToastProps = ToastType & {
	onDismiss: () => void;
};

const Toast = ({
	title,
	message,
	variant,
	duration,
	onDismiss,
}: ToastProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const [isLeaving, setIsLeaving] = useState(false);
	const timerRef = useRef<NodeJS.Timeout>();
	const enterTimerRef = useRef<NodeJS.Timeout>();

	const styles = variantStyles[variant];

	const handleDismiss = useCallback(() => {
		setIsLeaving(true);
		setTimeout(() => {
			onDismiss();
		}, 300); // Match animation duration
	}, [onDismiss]);

	useEffect(() => {
		// Small delay before triggering enter animation for smoother appearance
		enterTimerRef.current = setTimeout(() => {
			setIsVisible(true);
		}, 10);

		// Auto-dismiss after duration with animation
		// Each toast gets its own timer from when it mounts
		timerRef.current = setTimeout(() => {
			handleDismiss();
		}, duration);

		// Cleanup on unmount only
		return () => {
			if (enterTimerRef.current) clearTimeout(enterTimerRef.current);
			if (timerRef.current) clearTimeout(timerRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty deps - only run once on mount

	return (
		<div
			className={classNames(
				"flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-xl backdrop-blur-sm transition-all duration-300 ease-out min-w-[320px] max-w-md",
				styles.container,
				isVisible && !isLeaving
					? "translate-x-0 opacity-100"
					: "translate-x-full opacity-0",
			)}
		>
			{/* Icon */}
			<div
				className={classNames(
					"flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold",
					styles.iconBg,
				)}
			>
				{styles.icon}
			</div>

			{/* Content */}
			<div className="flex-1 min-w-0">
				<h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
				{message && <p className="text-gray-200 text-sm">{message}</p>}
			</div>

			{/* Dismiss Button */}
			<button
				onClick={handleDismiss}
				className="flex-shrink-0 text-gray-300 hover:text-white transition-colors"
				aria-label="Dismiss"
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
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	);
};

export default Toast;
