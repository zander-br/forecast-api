import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export type RequestConfig = AxiosRequestConfig;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response<T = any> = AxiosResponse<T>;

export class Request {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly request = axios) { }

  public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public static isRequestError(error: AxiosError): boolean {
    return !!(error.response && error.response.status);
  }
}
