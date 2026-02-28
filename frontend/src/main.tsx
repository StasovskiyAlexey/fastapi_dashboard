import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AppProvider from "./providers/AppProvider";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AppProvider>
      <App />
    </AppProvider>
  );
}
