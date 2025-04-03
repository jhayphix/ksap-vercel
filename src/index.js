// React modules
import ReactDOM from "react-dom/client";

// Components
import App from "@src/App";

// Assets

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "@assets/styles/rootVariables.css";
import "@assets/styles/appLayout.css";
import "@assets/styles/typography.css";
import "@assets/styles/theme.css";
import "@assets/styles/form.css";

import "@assets/utilityStyles/utils.css";
import "@assets/utilityStyles/gradient.css";
import "@assets/utilityStyles/button.css";
import "@assets/utilityStyles/effect.css";

import "@layouts/navigation.css";

// Components
import "@components/tabs/tabs.css";

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<App />);
