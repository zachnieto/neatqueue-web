import { useHookstate } from "@hookstate/core";
import { Outlet } from "react-router-dom";
import globalState, { sessionReadyState } from "../../state";

const LoggedInRoutes = () => {
	const state = useHookstate(globalState);
	const ready = useHookstate(sessionReadyState);
	const { user } = state.get();

	// Redirect only after session is ready and we know there's no user
	if (ready.get() && !user?.id) {
		window.open(import.meta.env.VITE_DISCORD_AUTH, "_self");
		return <></>;
	}

	return <Outlet />;
};

export default LoggedInRoutes;
