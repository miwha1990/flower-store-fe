import axios, {
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { getCookie, removeCookie } from 'react-use-cookie';

type HTTPMethod = 'get' | 'post' | 'delete' | 'put' | 'patch';

export interface JsonBody {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface RequestOptions {
  withHeaders?: boolean;
}

interface Request {
  method: HTTPMethod;
  url: string;
  body?: JsonBody | FormData;
}

const buildRequest = (request: Request) => {
  const { body, method, url } = request;
  const API_TOKEN = getCookie('API_TOKEN');
  const API_HOST_URL = import.meta.env.VITE_API_URL;

  const headers = {
    ...(body instanceof FormData ? {} : { 'content-type': 'application/json' }),
    Authorization: `Bearer ${API_TOKEN}`,
  };

  const requestConfig: AxiosRequestConfig = {
    baseURL: API_HOST_URL,
    data: body,
    headers,
    method,
    url,
    withCredentials: false,
  };

  return requestConfig;
};

const defaultResponse: Partial<AxiosError['response']> = {
  status: 500,
  data: {
    error: 'Server error',
  },
};

const formatError = (responseError: AxiosError) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response: any = responseError?.response || defaultResponse;
  const errors =
    (response.data && (response.data.message || [response.data.error])) || [];

  return {
    code: response.status,
    message: errors,
  };
};

export const makeRequest = async <T>(
  request: Request,
): Promise<T> => {
  const requestConfig = buildRequest(request);

  return new Promise((resolve, reject) => {
    const axiosRequest: AxiosPromise = axios(requestConfig);
    axiosRequest
      .then((response: AxiosResponse<T>) => {
        resolve(response.data);
      })
      .catch((error) => {
        const hasRedirectTo404 =
          error.response &&
          error.response.status === 404 &&
          window.location.pathname !== '/404';

        if (![401, 403, 500].includes(error?.response?.status)) {
          console.error(
            `error: ${JSON.stringify(error.response?.data?.error)} url: ${error.response?.request?.responseURL
            }`
          );
        }

        if (error?.response?.status === 401) {
          localStorage.removeItem('user');
          removeCookie('API_TOKEN');
          window.location.replace('/login');
        }

        if (hasRedirectTo404) {
          // window.location.replace('/404');
        } else {
          reject(formatError(error));
        }
      });
  });
};
