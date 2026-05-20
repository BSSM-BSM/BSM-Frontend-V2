import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import { useResetAtom } from "jotai/utils";
import { SignJWT } from "jose";
import { userState } from "@/store/account.store";
import { useModal } from "@/hooks/useModal";
import { useOverlay } from "@/hooks/useOverlay";

const apiTokenSecretKey = new TextEncoder().encode(process.env.NEXT_PUBLIC_API_TOKEN_SECRET_KEY ?? '');

const instance = axios.create({
  baseURL: '/api',
  headers: {
    Pragma: 'no-cache'
  },
  timeout: 5000,
});

export enum HttpMethod {
  GET,
  POST,
  PUT,
  DELETE
}

export interface ErrorResType {
  statusCode: number;
  message: string;
  fields?: Record<string, unknown>
}

export type Ajax = <T>({
  method,
  url,
  payload,
  config,
  errorCallback
}: AjaxType<T>) => Promise<[T, false] | [void, true]>;

interface AjaxType<T> {
  method: HttpMethod,
  url: string,
  payload?: object,
  config?: AxiosRequestConfig,
  errorCallback?: (data: ErrorResType | AxiosError | void) => boolean | void
}

export const useAjax = () => {
  const { loading, showAlert, showToast } = useOverlay();
  const { openModal } = useModal();
  const resetUser = useResetAtom(userState);

  const ajax: Ajax = async <T>({
    method,
    url,
    payload,
    config = {},
    errorCallback,
  }: AjaxType<T>) => {
    loading(true);

    try {
      const clientDateTime = new Date().toISOString();
      const apiToken = await new SignJWT({ dateTime: clientDateTime })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(apiTokenSecretKey);
      if (config.headers) {
        config.headers['x-api-token'] = apiToken;
      } else {
        config.headers = { 'x-api-token': apiToken };
      }

      const rawRes = (await ((): AxiosPromise<T> => {
        switch (method) {
          case HttpMethod.GET: return instance.get(url, config);
          case HttpMethod.POST: return instance.post(url, payload, config);
          case HttpMethod.PUT: return instance.put(url, payload, config);
          case HttpMethod.DELETE: return instance.delete(url, config);
        }
      })());
      loading(false);
      return [rawRes.data, false];
    } catch (err) {
      loading(false);
      console.error(err);

      if (!(err instanceof AxiosError) || !err.response?.status) {
        showAlert('알 수 없는 에러가 발생하였습니다');
        errorCallback && errorCallback();
        return [, true];
      };
      if (!err.response.data) {
        showAlert(err.message);
        errorCallback && errorCallback(err);
        return [, true];
      }
      if (!err.response.data.statusCode) {
        showAlert(`HTTP ERROR ${err.response.status}`);
        errorCallback && errorCallback(err.response.data);
        return [, true];
      }
      if (errorCallback && errorCallback(err.response.data)) {
        return [, true];
      }
      errorHandler(err.response.status, err.response.data);
      return [, true];
    }
  }

  const errorHandler = (statusCode: number, errorData: any) => {
    switch (statusCode) {
      case 401: {
        resetUser();
        openModal({ key: 'login' });
        break;
      }
      case 400: {
        const fields = errorData.fields as { [filed: string]: string };
        if (fields['errorType'] === 'apiTokenFail') {
          return apiTokenErrorHandler(fields);
        }
        Object.entries(fields).forEach(field => {
          showToast(`${field[0]}: ${field[1]}`);
        });
        break;
      }
      case 429: {
        showAlert('잠시 후에 다시 시도해주세요.');
        break;
      }
      default: showAlert(`에러코드: ${statusCode} ${errorData.message}`);
    }
  }

  const apiTokenErrorHandler = (data: { serverTime?: string, clientTime?: string }) => {
    if (!data.serverTime || !data.clientTime) {
      return showAlert('API 요청이 유효하지 않습니다.');
    }
    const serverTime = new Date(data.serverTime);
    const clientTime = new Date(data.clientTime);
    openModal({ key: 'invalidClientTime' }, { serverTime, clientTime });
  }

  return {
    ajax
  }
}