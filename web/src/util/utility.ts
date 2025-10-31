export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const calculateTimeLeft = (timestamp: number) => {
	const difference = new Date(timestamp * 1000).getTime() - Date.now();

	let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

	if (difference > 0) {
		timeLeft = {
			days: Math.floor(difference / (1000 * 60 * 60 * 24)),
			hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((difference / 1000 / 60) % 60),
			seconds: Math.floor((difference / 1000) % 60),
		};
	}
	return timeLeft;
};

export const displayPercent = (percent: number): string =>
	`${(percent * 100).toFixed(1)}%`;

export const floatToNDecimalsString = (num: number, decimals: number = 2) => {
	const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`);
	const match = num.toString().match(regex);
	return match ? match[0] : null;
};

export const floatToNDecimals = (num: number, decimals: number = 2) => {
	const regex = new RegExp(`^-?\\d+(?:\\.\\d{0,${decimals}})?`);
	const match = num.toString().match(regex);
	// @ts-expect-error
	return Number(match[0]);
};

export const floatToPrice = (num: number) => {
	return Math.ceil(num * 100) / 100;
};


export type WinRateColors = {
	border: string;
	bg: string;
	text: string;
};

export const getWinRateColor = (winrate: number): WinRateColors => {
	// Interpolate between red (0%), yellow (45%), and green (55%+)
	// This favors green more heavily since 50% is average
	const percentage = winrate * 100;

	if (percentage <= 45) {
		// Interpolate from red to yellow (0% to 45%)
		const ratio = percentage / 45;
		const red = 220; // Starting red value
		const green = Math.round(180 * ratio); // Interpolate to yellow
		return {
			border: `rgb(${red}, ${green}, 0)`,
			bg: `rgba(${red}, ${green}, 0, 0.2)`,
			text: `rgb(${red}, ${green + 20}, 0)`,
		};
	} else if (percentage <= 55) {
		// Interpolate from yellow to green (45% to 55%)
		const ratio = (percentage - 45) / 10;
		const red = Math.round(220 * (1 - ratio)); // Fade out red quickly
		const green = Math.round(180 + 75 * ratio); // Increase green
		return {
			border: `rgb(${red}, ${green}, 0)`,
			bg: `rgba(${red}, ${green}, 0, 0.2)`,
			text: `rgb(${Math.max(red - 20, 0)}, ${green}, 0)`,
		};
	} else {
		// Full green for 55%+ (good performance)
		const ratio = Math.min((percentage - 55) / 45, 1); // 55% to 100%
		const green = Math.round(200 + 55 * ratio); // Brighter green for higher winrates
		return {
			border: `rgb(0, ${green}, 0)`,
			bg: `rgba(0, ${green}, 0, 0.2)`,
			text: `rgb(0, ${Math.min(green + 20, 255)}, 0)`,
		};
	}
};
