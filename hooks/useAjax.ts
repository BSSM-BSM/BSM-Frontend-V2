import axios, { AxiosError, AxiosPromise, RawAxiosRequestConfig } from "axios";
import { useResetRecoilState } from "recoil";
import { userState } from "@/store/account.store";
import { useModal } from "@/hooks/useModal";
import { useOverlay } from "@/hooks/useOverlay";

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
  config?: RawAxiosRequestConfig,
  errorCallback?: (data: ErrorResType | AxiosError | void) => boolean | void
}

export const useAjax = () => {
  const { loading, showAlert, showToast } = useOverlay();
  const { openModal } = useModal();
  const resetUser = useResetRecoilState(userState);

  const ajax: Ajax = async <T>({
    method,
    url,
    payload,
    config,
    errorCallback,
  }: AjaxType<T>) => {
    loading(true);

    try {
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
        openModal('login');
        break;
      }
      case 400: {
        const fields = errorData.fields as { [filed: string]: string };
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

  return {
    ajax
  }
}