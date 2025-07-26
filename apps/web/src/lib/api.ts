const getApiConfig = () => {
  const isProd = window.location.hostname === 'huntoru-web.pages.dev';

  return {
    baseUrl: isProd
      ? 'https://huntoru-api.nka21dev.workers.dev/'
      : 'http://localhost:8787/',
  };
};

export const API_CONFIG = getApiConfig();
