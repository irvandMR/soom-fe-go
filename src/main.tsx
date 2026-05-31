import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			staleTime: 5 * 60 * 1000, // 5 menit
			// staleTime: 30 * 1000, // 3 Detik
		},
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<App />
			</QueryClientProvider>
		</BrowserRouter>
	</StrictMode>,
);
