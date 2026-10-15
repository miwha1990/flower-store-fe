import { AxiosResponse } from 'axios';
import { JsonBody, makeRequest, RequestOptions } from './requestBuilder';

type RequestBody = JsonBody | FormData;

type RequestMethod = <T>(
    config?: RequestOptions,
) => (url: string, body?: RequestBody) => Promise<AxiosResponse<{data: T}>>;

type RequestType = <T>(url: string, body?: RequestBody) => Promise<T>
interface ApiWrapper {
    get: RequestType;
    post: RequestType;
    patch: RequestType;
    put: RequestType;
    delete: RequestType;
}

export const API: ApiWrapper = {
    get: async <T>(url: string): Promise<T> =>
        makeRequest<T>(
            {
                method: 'get',
                url,
            },
        
        ),

    post: async <T>(url: string, body?: JsonBody): Promise<T> =>
        makeRequest<T>(
            {
                method: 'post',
                body,
                url,
            },
    
        ),

    patch: async <T>(url: string, body?: JsonBody): Promise<T> =>
        makeRequest<T>(
            {
                method: 'patch',
                body,
                url,
            },
        ),

    put: async <T>(url: string, body?: JsonBody): Promise<T> =>
        makeRequest<T>(
            {
                method: 'put',
                body,
                url,
            },
        
        ),

    delete: async <T>(url: string): Promise<T> =>
        makeRequest<T>(
            {
                method: 'delete',
                url,
            },
        ),
};
