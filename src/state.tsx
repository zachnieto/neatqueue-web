import { hookstate } from "@hookstate/core";
import { localstored } from "@hookstate/localstored";
import type { Session } from "./types";

export const defaultState: Session = {
	auth: undefined,
	user: undefined,
	guilds: undefined,
	stats: {
		servers: -1,
		players: -1,
		games: -1,
	},
};

const globalState = hookstate(
	defaultState,
	// @ts-expect-error
	localstored({ key: "session", engine: sessionStorage }),
);

export default globalState;
