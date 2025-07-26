const getApiConfig = () => {
  // const isProd = window.location.hostname === 'huntoru-web.pages.dev';

  return {
    baseUrl: 'https://huntoru-api.nka21dev.workers.dev/',
    // baseUrl: 'http://localhost:8787/',
  };
};

export const API_CONFIG = getApiConfig();
