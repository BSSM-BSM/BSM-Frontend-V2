export enum LocalStorageType {
    json,
    string,
    number,
    boolean,
}

interface LocalStorageEffect {
    key: string,
}

interface JsonType extends LocalStorageEffect {
    defaultValue?: object,
    type: LocalStorageType.json
}

interface StringType extends LocalStorageEffect {
    defaultValue?: string,
    type: LocalStorageType.string
}

interface NumberType extends LocalStorageEffect {
    defaultValue?: number,
    type: LocalStorageType.number
}

interface BooleanType extends LocalStorageEffect {
    defaultValue?: boolean,
    type: LocalStorageType.boolean
}

const decode = (defaultValue: string, type: LocalStorageType) => {
    switch (type) {
        case LocalStorageType.json: return JSON.parse(defaultValue);
        case LocalStorageType.string: return defaultValue;
        case LocalStorageType.number: return Number(defaultValue);
        // 'false'는 JSON.parse로 해야 제대로 변환됨
        case LocalStorageType.boolean: return JSON.parse(defaultValue);
    }
}
const encode = (defaultValue: any, type: LocalStorageType) => {
    switch (type) {
        case LocalStorageType.json: return JSON.stringify(defaultValue);
        default: return String(defaultValue);
    }
}

export const localStorageEffect = ({key, type, defaultValue}: (JsonType | StringType | NumberType | BooleanType)) =>
({ setSelf, onSet }: any) => {
    const localStorage = typeof window !== 'undefined'? window.localStorage: null;

    const savedValue = localStorage && localStorage.getItem(key);
    if (savedValue === null && defaultValue !== undefined) {
        setSelf(defaultValue);
        localStorage?.setItem(key, encode(defaultValue, type));
    } else {
        savedValue !== null && setSelf(decode(savedValue, type));
    }

    onSet((newValue: any, _: any, isReset: boolean) => {
        isReset
        ? localStorage && localStorage.removeItem(key)
        : localStorage && localStorage.setItem(key, encode(newValue, type));
    });

};