export enum LocalStorageType {
    json,
    string,
    number,
    boolean,
}

export const localStorageEffect = (key: string, type: LocalStorageType) =>
  ({ setSelf, onSet }: any) => {
    const decode = (str: string) => {
        switch (type) {
            case LocalStorageType.json: return JSON.parse(str);
            case LocalStorageType.string: return str;
            case LocalStorageType.number: return Number(str);
            // 'false'는 JSON.parse로 해야 제대로 변환됨
            case LocalStorageType.boolean: return JSON.parse(str);
        }
    }
    const encode = (str: any) => {
        switch (type) {
            case LocalStorageType.json: return JSON.stringify(str);
            default: return String(str);
        }
    }

    const localStorage = typeof window !== 'undefined'? window.localStorage: null;

    const savedValue = localStorage && localStorage.getItem(key);
    if (savedValue !== null) {
        setSelf(decode(savedValue));
    }
    onSet((newValue: any, _: any, isReset: boolean) => {
        isReset
        ?localStorage && localStorage.removeItem(key)
        :localStorage && localStorage.setItem(key, encode(newValue));
    });

};