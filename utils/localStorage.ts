export const localStorageEffect = (key: string, type: string) =>
  ({ setSelf, onSet }: any) => {
    const decode = (str: string) => {
        switch (type) {
            case 'json': return JSON.parse(str);
            case 'string': return str;
            case 'number': return Number(str);
        }
    }
    const encode = (str: any) => {
        switch (type) {
            case 'json': return JSON.stringify(str);
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