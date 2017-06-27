import { createStore, applyMiddleware, compose } from "redux";
import { persistState } from "redux-devtools";
import promiseMiddleware from "redux-promise-middleware";
import { routerMiddleware } from "redux-json-router";
import createLogger from "redux-logger";

import rootReducer from "../reducer";
import DevTools from "../DevTools";

/**
 * Entirely optional.
 * This tiny library adds some functionality to your DevTools,
 * by logging actions/state to your console. Used in conjunction
 * with your standard DevTools monitor gives you great flexibility.
 */
const logger = createLogger();

// By default we try to read the key from ?debug_session=<key> in the address bar
const getDebugSessionKey = function() {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return matches && matches.length ? matches[1] : null;
};

function configureStore(history, initialState) {
  const middlewares = [
    promiseMiddleware(),
    logger,
    require("redux-immutable-state-invariant")(),
    routerMiddleware(history)
  ];

  const enhancer = compose(
    applyMiddleware(...middlewares),
    window.devToolsExtension
      ? window.devToolsExtension()
      : DevTools.instrument(),
    // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
    persistState(getDebugSessionKey())
  );

  const store = createStore(rootReducer, initialState, enhancer);

  // Enable hot module replacement for reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept("../reducer", () => {
      const nextReducer = require("../reducer").default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default configureStore;
