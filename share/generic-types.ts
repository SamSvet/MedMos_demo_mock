export type CustomOmit<T, K extends keyof T> = {
  [Key in keyof T as Key extends K ? never : Key]: T[Key];
};

export type CustomGroup<T, K extends keyof T> = {
  [Key in keyof T]: Key extends K ? T[Key][] | null : T[Key];
};

export type NonOptionalKeys<T> = {
  [k in keyof T]-?: undefined extends T[k] ? never : k;
}[keyof T];

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type RequiredLiteralKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : {} extends Pick<T, K>
    ? never
    : K]: 0;
};

type OptionalLiteralKeys<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : {} extends Pick<T, K>
    ? K
    : never]: 0;
};

type IndexKeys<T> = string extends keyof T
  ? string
  : number extends keyof T
  ? number
  : never;
