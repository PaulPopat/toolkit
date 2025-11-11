export type CssPropertyModel = string | number;

export type CssBlockModel = Record<string, CssPropertyModel | Record<string, CssPropertyModel>>;

export type CssModel = Record<string, CssBlockModel>;
