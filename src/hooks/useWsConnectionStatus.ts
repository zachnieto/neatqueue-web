import { useEffect, useState } from "react";
import { getWsSocket } from "../services/ws-service";

export function useWsConnectionStatus(): {
	connected: boolean;
	lastError: string | null;
} {
	const [connected, setConnected] = useState(false);
	const [lastError, setLastError] = useState<string | null>(null);

	useEffect(() => {
		const socket = getWsSocket();
		setConnected(socket.connected);
		setLastError(socket.getLastError());
		const unsub = socket.addConnectionChangeListener((isConnected, error) => {
			setConnected(isConnected);
			setLastError(error ?? socket.getLastError());
		});
		return unsub;
	}, []);

	return { connected, lastError };
}
