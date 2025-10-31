import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export type Toast = {
	id: string;
	title: string;
	message?: string;
	variant: ToastVariant;
	duration: number;
};

type ToastContextType = {
	toasts: Toast[];
	showToast: (
		title: string,
		options?: {
			message?: string;
			variant?: ToastVariant;
			duration?: number;
		},
	) => void;
	dismissToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback(
		(
			title: string,
			options?: {
				message?: string;
				variant?: ToastVariant;
				duration?: number;
			},
		) => {
			const id = Math.random().toString(36).substring(2, 9);
			const toast: Toast = {
				id,
				title,
				message: options?.message,
				variant: options?.variant || "info",
				duration: options?.duration || 5000,
			};

			setToasts((prev) => [...prev, toast]);
		},
		[],
	);

	const dismissToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
			{children}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
};
