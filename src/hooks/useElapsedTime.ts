import { useEffect, useState } from "react";

function formatElapsed(ms: number): string {
	if (ms < 0) return "0:00";
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	if (hours > 0) {
		return `${hours}h ${minutes}m ${seconds}s`;
	}
	if (minutes > 0) {
		return `${minutes}m ${seconds}s`;
	}
	return `${seconds}s`;
}

/**
 * Returns a live-updating formatted duration since the given ISO timestamp.
 * Updates every second. Returns "—" when start is null/undefined or invalid.
 */
export function useElapsedTime(isoStart: string | null | undefined): string {
	const [elapsed, setElapsed] = useState<string>(() => {
		if (!isoStart) return "—";
		const start = Date.parse(isoStart);
		if (Number.isNaN(start)) return "—";
		return formatElapsed(Date.now() - start);
	});

	useEffect(() => {
		if (!isoStart) {
			setElapsed("—");
			return;
		}
		const start = Date.parse(isoStart);
		if (Number.isNaN(start)) {
			setElapsed("—");
			return;
		}
		const tick = () => setElapsed(formatElapsed(Date.now() - start));
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [isoStart]);

	return elapsed;
}
