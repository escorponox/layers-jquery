const documentReady = (cb) => {
  document.readyState === "interactive" || document.readyState === "complete" ? cb() : document.addEventListener("DOMContentLoaded", cb);
};

export default documentReady;
