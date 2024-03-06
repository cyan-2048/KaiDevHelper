import { render } from "preact";
import App from "./App.tsx";
import "./styles.scss";

/**
 * import polyfills manually
 */
import "core-js/actual/array/flat";
import "core-js/actual/array/find-last";
import "core-js/actual/array/to-sorted";
import "core-js/actual/string/match-all";

render(<App />, document.body);
