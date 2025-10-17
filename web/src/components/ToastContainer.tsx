import { useToast } from "../hooks/useToast";
import Toast from "./Toast";

const ToastContainer = () => {
	const { toasts, dismissToast } = useToast();

	return (
		<div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className="pointer-events-auto transition-all duration-300 ease-out"
				>
					<Toast {...toast} onDismiss={() => dismissToast(toast.id)} />
				</div>
			))}
		</div>
	);
};

export default ToastContainer;
