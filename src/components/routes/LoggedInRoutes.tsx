import { useHookstate } from "@hookstate/core";
import { Outlet } from "react-router-dom";
import globalState from "../../state";

const LoggedInRoutes = () => {
	const state = useHookstate(globalState);
	const { user } = state.get();

	if (!user?.id) {
		window.open(import.meta.env.VITE_DISCORD_AUTH, "_self");
		return <></>;
	}

	return <Outlet />;
};

export default LoggedInRoutes;
