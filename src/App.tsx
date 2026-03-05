import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Admin from "./components/admin/Admin";
import Footer from "./components/Footer";
import Home from "./components/home/Home";
import Leaderboard from "./components/Leaderboard";
import Manage from "./components/manage/Manage";
import Nav from "./components/Nav";
import CustomParticles from "./components/Particles";
import Privacy from "./components/Privacy";
import AdminRoutes from "./components/routes/AdminRoutes";
import LoggedInRoutes from "./components/routes/LoggedInRoutes";
import ShortURL from "./components/ShortURL";
import Status from "./components/Status";
import ToastContainer from "./components/ToastContainer";
import Transcript from "./components/Transcript";
import { ToastProvider } from "./hooks/useToast";
import HistoryPage from "./pages/HistoryPage";
import LinkAccountPage from "./pages/LinkAccountPage";
import ProfilePage from "./pages/ProfilePage";
import ServerQueuesPage from "./pages/ServerQueuesPage";
import ServersPage from "./pages/ServersPage";
import { getSession } from "./services/server-service";

const queryClient = new QueryClient();

/** Path prefixes where the particle background should be hidden (e.g. dense queue UIs). */
const PARTICLES_HIDDEN_PATH_PREFIXES = ["/servers/d"];

function useShowParticles() {
	const { pathname } = useLocation();
	return !PARTICLES_HIDDEN_PATH_PREFIXES.some((prefix) =>
		pathname.startsWith(prefix),
	);
}

function App() {
	useEffect(() => {
		getSession();
	}, []);

	const showParticles = useShowParticles();

	return (
		<QueryClientProvider client={queryClient}>
			<ToastProvider>
				<div className="container-fluid px-5 relative">
					{showParticles && <CustomParticles color={""} clickable={false} />}

					<Nav />
					<Routes>
						<Route path="/" element={<Home />} />
						<Route
							path="/leaderboard/:guildID/:channelID"
							element={<Leaderboard />}
						/>
						<Route path="/lb/:shortUrl" element={<ShortURL />} />
						<Route
							path="/transcript/:guildID/:gameNum"
							element={<Transcript />}
						/>
						<Route path="/status" element={<Status />} />
						<Route path="/privacy" element={<Privacy />} />

						<Route element={<LoggedInRoutes />}>
							<Route path="/servers" element={<ServersPage />} />
							<Route path="/servers/:serverId" element={<ServerQueuesPage />} />
							<Route
								path="/dashboard"
								element={<Navigate to="/servers" replace />}
							/>
							<Route path="/manage/:guildID" element={<Manage />} />
							<Route path="/profile" element={<ProfilePage />} />
						</Route>

						<Route element={<AdminRoutes />}>
							<Route path="/admin" element={<Admin />} />
						</Route>

						<Route path="/link-account/steam" element={<LinkAccountPage />} />
						<Route path="/history/:serverId" element={<HistoryPage />} />
					</Routes>

					<Footer />
					<ToastContainer />
				</div>
			</ToastProvider>
		</QueryClientProvider>
	);
}

export default App;
