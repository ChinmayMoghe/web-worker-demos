import { useEffect } from "react";
import useAutoRefresh from "../AutoRefresh/useAutoRefresh";
import useFetch from "../hooks/useFetch";

const Posts = () => {
  const { token, killRefresh } = useAutoRefresh("posts", 4000);
  const { callFetch, data, error, loading } = useFetch(
    "https://jsonplaceholder.typicode.com/posts"
  );

  useEffect(() => {
    if (token && !error) {
      callFetch();
    }
    if (error) {
      killRefresh();
    }
  }, [token, error]);

  return (
    <div>
      {error && `Something went wrong`}
      {loading && `loading...`}
      {data && <pre>{JSON.stringify(data, null, 3)}</pre>}
    </div>
  );
};

export default Posts;
