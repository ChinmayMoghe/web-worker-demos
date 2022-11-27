const worker = new Worker(new URL("./autorefresh.worker.js", import.meta.url), {
  type: "module",
});

const RefreshWorker = Object.seal(worker);

export default RefreshWorker;
