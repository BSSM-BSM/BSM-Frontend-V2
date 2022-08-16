export const localStorageEffect = (key: string, type: string) =>
  ({ setSelf, onSet }: any) => {
    const convertValue = (str: string) => {
        switch (type) {
            case 'json': return JSON.parse(str);
            case 'string': return str;
            case 'number': return Number(str);
        }
    }

    const localStorage = typeof window !== 'undefined'? window.localStorage: null;

    const savedValue = localStorage && localStorage.getItem(key);
    if (savedValue !== null) {
        setSelf(convertValue(savedValue));
    }
    onSet((newValue: any, _: any, isReset: boolean) => {
        isReset
        ?localStorage && localStorage.removeItem(key)
        :localStorage && localStorage.setItem(key, convertValue(newValue));
    });

};