import { useState } from "react";
import Posts from "./Posts";

// example of a web worker
const poller = new Worker(new URL("./poller.js", import.meta.url), {
  type: "module",
});

poller.addEventListener("error", (ev) => {
  console.log(ev);
});

const App = () => {
  const [data, setData] = useState("");
  poller.onmessage = (ev) => {
    setData(ev.data);
  };
  return (
    <div>
      <span>Set interval inside a web worker {data}</span>
      <Posts />
    </div>
  );
};

export default App;
