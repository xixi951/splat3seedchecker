(function () {
  "use strict";

  var bundledReplayLookupBase = "http://8.219.115.201";
  var defaultReplayLookupBase = "https://api.xixi-splat.com";
  var configuredBase = new URLSearchParams(window.location.search).get("api") ||
    window.SPLAT3_REPLAY_LOOKUP_BASE ||
    defaultReplayLookupBase;

  function rewriteUrl(value) {
    if (typeof value !== "string") return value;
    if (value.indexOf(bundledReplayLookupBase) === 0) {
      return configuredBase.replace(/\/$/, "") + value.slice(bundledReplayLookupBase.length);
    }
    return value;
  }

  var originalFetch = window.fetch;
  if (typeof originalFetch === "function") {
    window.fetch = function (input, init) {
      if (typeof input === "string") {
        return originalFetch.call(this, rewriteUrl(input), init);
      }

      if (input instanceof URL) {
        return originalFetch.call(this, new URL(rewriteUrl(input.toString())), init);
      }

      if (input instanceof Request) {
        var nextUrl = rewriteUrl(input.url);
        if (nextUrl !== input.url) {
          return originalFetch.call(this, new Request(nextUrl, input), init);
        }
      }

      return originalFetch.call(this, input, init);
    };
  }

  document.documentElement.dataset.selfhost = "xixi";
  window.__SPLAT3_SELFHOST__ = {
    replayLookupBase: configuredBase,
    originalProject: "https://github.com/Leanny/splat3seedchecker",
  };
})();
