import { useHookstate } from "@hookstate/core";
import { Navigate, Outlet } from "react-router-dom";
import globalState, { sessionReadyState } from "../../state";

const AdminRoutes = () => {
	const state = useHookstate(globalState);
	const ready = useHookstate(sessionReadyState);
	const { user } = state.get();

	if (!ready.get()) {
		return null;
	}

	if (!user?.id) {
		window.open(import.meta.env.VITE_DISCORD_AUTH, "_self");
		return null;
	}

	return user?.admin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoutes;
