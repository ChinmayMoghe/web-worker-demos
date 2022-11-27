import { useCallback, useEffect, useReducer, useRef } from "react";
import RefreshWorker from "./AutoRefreshWorker";

const actionForId =
  (id) =>
  (action, payload = {}) => {
    return { action, payload: { ...payload, id } };
  };

const INITIAL_AUTO_REFRESH_STATE = { id: "", token: "" };
const AutoRefreshReducer = (state, { type, payload }) => {
  switch (type) {
    case "initialize":
      return {
        ...state,
        id: payload.id,
      };
    case "update":
      return {
        ...state,
        token: payload.token,
      };
    case "kill":
      return {
        ...INITIAL_AUTO_REFRESH_STATE,
      };
    default:
      return state;
  }
};

const useAutoRefresh = (refreshId, duration) => {
  const [{ token }, dispatch] = useReducer(
    AutoRefreshReducer,
    INITIAL_AUTO_REFRESH_STATE
  );
  const initializeRef = useRef(false);
  const createMessage = actionForId(refreshId);
  const initializeRefresh = useCallback((duration) => {
    if (!initializeRef.current) {
      RefreshWorker.postMessage(createMessage("initialize", { duration }));
      initializeRef.current = true;
    }
  }, []);

  const killRefresh = useCallback(() => {
    if (initializeRef.current) {
      RefreshWorker.postMessage(createMessage("kill"));
      initializeRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (refreshId && duration) {
      initializeRefresh(duration);
    }
    return () => killRefresh();
  }, []);

  useEffect(() => {
    const handleRefreshWorkerMessage = (ev) => {
      const { id, token } = ev.data;
      if (id === refreshId) {
        dispatch({ type: "update", payload: { token } });
      }
    };
    RefreshWorker.addEventListener("message", handleRefreshWorkerMessage);
    return () =>
      RefreshWorker.removeEventListener("message", handleRefreshWorkerMessage);
  }, []);

  return { token, initializeRefresh, killRefresh };
};

export default useAutoRefresh;
