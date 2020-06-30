const ENV = process.env.NODE_ENV;

const { hostname } = window.location;

const PORT = process.env.REACT_APP_BASE_PORT || 80;

const baseUrl = process.env.REACT_APP_BASE_URL;

const headerDefaultToken = {
  production: {
    'X-tianrang-lava-token': '11223344556677889910',
  },
  test: {
    'X-tianrang-lava-token': '11223344556677889910',
  },
  development: {
    'X-tianrang-dmp-token': '11223344556677889910',
  },
};

const HOST_ENV_PORT = {
  production: `//${hostname}:${PORT}`,
  test: baseUrl,
  development: baseUrl,
};

export const HOST_PORT = HOST_ENV_PORT[ENV];
export const DEFAULT_HEADER = headerDefaultToken[ENV];
