// src/config.js
let API_BASE_URL = process.env.REACT_APP_API_URL_LIVE; // default to live

if (window.location.hostname === "localhost") {
  API_BASE_URL = process.env.REACT_APP_API_URL_LOCAL;
}

export { API_BASE_URL };
