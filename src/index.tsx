import {Provider} from "react-redux";
import App from "./App";
import {store} from "./redux/store";
import {createRoot} from "react-dom/client";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);