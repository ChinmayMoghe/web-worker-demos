import { useState } from "react";

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
  return <div>Set interval inside a web worker {data}</div>;
};

export default App;
