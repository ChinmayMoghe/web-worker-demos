import { useEffect, useReducer } from "react";

const INITIAL_FETCH_STATE = {
  data: null,
  error: "",
  loading: false,
};

const FETCH_ACTION_TYPES = {
  loading: "LOADING",
  error: "ERROR",
  fulfilled: "FULFILLED",
};

const fetchReducer = (state, { type, payload }) => {
  switch (type) {
    case FETCH_ACTION_TYPES.loading:
      return { ...state, data: {}, loading: true, error: "" };
    case FETCH_ACTION_TYPES.error:
      return { ...state, data: {}, loading: false, error: payload };
    case FETCH_ACTION_TYPES.fulfilled:
      return { ...state, data: payload, loading: false, error: "" };
    default:
      return state;
  }
};

const useFetch = (endpoint) => {
  const [{ data, loading, error }, dispatch] = useReducer(
    fetchReducer,
    INITIAL_FETCH_STATE
  );
  useEffect(() => {
    console.log({ data, loading, error });
  }, [data, loading, error]);

  const callFetch = async (options) => {
    dispatch({ type: FETCH_ACTION_TYPES.loading });
    try {
      const response = await fetch(endpoint, options);
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: FETCH_ACTION_TYPES.fulfilled, payload: data });
      } else {
        throw `API failed with ${response.status}`;
      }
    } catch (error) {
      console.log("error :", error);
      dispatch({
        type: FETCH_ACTION_TYPES.error,
        payload: error?.message || "Something went wrong",
      });
    }
  };
  return { callFetch, data, error, loading };
};

export default useFetch;
