/**
 * Simple feature flag system for local development.
 *
 * Usage (browser console):
 *   ff.enable('web-queue')
 *   ff.disable('web-queue')
 *   ff.toggle('web-queue')
 *   ff.isEnabled('web-queue')
 *   ff.list()
 *   ff.clear()
 */

const STORAGE_KEY = "nq_feature_flags";

function load(): Record<string, boolean> {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
	} catch {
		return {};
	}
}

function save(flags: Record<string, boolean>) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
}

export const featureFlags = {
	enable(flag: string) {
		const flags = load();
		flags[flag] = true;
		save(flags);
		console.log(`✅ Feature flag "${flag}" enabled`);
	},

	disable(flag: string) {
		const flags = load();
		flags[flag] = false;
		save(flags);
		console.log(`❌ Feature flag "${flag}" disabled`);
	},

	toggle(flag: string) {
		const flags = load();
		flags[flag] = !flags[flag];
		save(flags);
		console.log(
			`${flags[flag] ? "✅" : "❌"} Feature flag "${flag}" ${flags[flag] ? "enabled" : "disabled"}`,
		);
	},

	isEnabled(flag: string): boolean {
		return load()[flag] === true;
	},

	list() {
		const flags = load();
		const entries = Object.entries(flags);
		if (entries.length === 0) {
			console.log("No feature flags set.");
			return flags;
		}
		console.table(
			Object.fromEntries(entries.map(([k, v]) => [k, { enabled: v }])),
		);
		return flags;
	},

	clear() {
		localStorage.removeItem(STORAGE_KEY);
		console.log("🗑️ All feature flags cleared");
	},
};

// Expose globally so it's accessible from the browser console
(window as Window & { ff: typeof featureFlags }).ff = featureFlags;
