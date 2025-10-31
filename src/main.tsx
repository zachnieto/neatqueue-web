import { NuqsAdapter } from "nuqs/adapters/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	// <React.StrictMode>
	<BrowserRouter>
		<NuqsAdapter>
			<App />
		</NuqsAdapter>
	</BrowserRouter>,
	// </React.StrictMode>
);
