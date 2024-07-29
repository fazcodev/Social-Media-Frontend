import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./Store/Store.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  
  <QueryClientProvider client={new QueryClient()}>
    <Provider store={store}>
      <App />
      <ReactQueryDevtools initialIsOpen={false}/>
    </Provider>
  </QueryClientProvider>
);
