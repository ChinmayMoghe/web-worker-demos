const timerMaps = new Map();

const generateToken = () => Math.random();

function initialize(duration, id) {
  const intervalId = setInterval(() => {
    postMessage({ token: generateToken(), id });
  }, duration);
  timerMaps.set(id, { intervalId, duration, running: true });
}

function kill(id) {
  const { intervalId } = timerMaps.get(id);
  clearInterval(intervalId);
  timerMaps.delete(id);
}

function toggle(id) {
  const { duration, running, intervalId } = timerMaps.get(id);
  if (running) {
    clearInterval(intervalId);
    timerMaps.set(id, { running: false, duration });
  } else {
    initialize(duration, id);
  }
}

handleMessage = (ev) => {
  const { action, payload } = ev.data;
  console.log({ action, payload });
  switch (action) {
    case "initialize":
      initialize(payload.duration, payload.id);
      break;
    case "toggle":
      toggle(payload.id);
      break;
    case "kill":
      kill(payload.id);
      break;
    default:
      break;
  }
};

self.onmessage = handleMessage;
