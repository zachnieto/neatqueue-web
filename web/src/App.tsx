import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Admin from "./components/admin/Admin";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Guide from "./components/Guide";
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
import { getSession } from "./services/server-service";

const queryClient = new QueryClient();

function App() {
	useEffect(() => {
		getSession();
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<ToastProvider>
				<div className="container-fluid px-5 relative">
					<>
						<CustomParticles color={""} clickable={false} />

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
							<Route path="/guide" element={<Guide />} />

							<Route element={<LoggedInRoutes />}>
								<Route path="/dashboard" element={<Dashboard />} />
								<Route path="/manage/:guildID" element={<Manage />} />
							</Route>

							<Route element={<AdminRoutes />}>
								<Route path="/admin" element={<Admin />} />
							</Route>

							<Route path="/history/:serverId" element={<HistoryPage />} />
						</Routes>

						<Footer />
					</>
					<ToastContainer />
				</div>
			</ToastProvider>
		</QueryClientProvider>
	);
}

export default App;
