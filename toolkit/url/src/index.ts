export const Slug = Symbol();

type Parameters = Record<string, string | Array<string>> & {
  [Slug]?: string;
};

export default class Url {
  readonly #pattern: string;
  readonly #parameters: Parameters;

  constructor(pattern: string, parameters: Parameters = {}, base_url?: string) {
    this.#pattern = pattern;
    if (base_url) {
      if (base_url.endsWith("/"))
        base_url = base_url.substring(0, base_url.length - 1);
      if (!pattern.startsWith("/")) pattern = "/" + pattern;
      this.#pattern = base_url + pattern;
    }

    this.#parameters = parameters;
  }

  get Href() {
    let pattern = this.#pattern;
    if (this.#parameters[Slug]) {
      pattern = pattern.replace("**", this.#parameters[Slug]);
    }

    return Object.keys(this.#parameters)
      .map((k) => [k, this.#parameters[k]] as const)
      .reduce(
        (c, [key, value]) =>
          typeof value === "string" && c.includes(":" + key)
            ? c.replaceAll(":" + key, value)
            : [
                c,
                Array.isArray(value)
                  ? value
                      .map((v) =>
                        [key, v].map((c) => encodeURIComponent(c)).join("=")
                      )
                      .join("&")
                  : [key, value].map((c) => encodeURIComponent(c)).join("="),
              ].join(c.includes("?") ? "&" : "?"),
        pattern
      );
  }

  async Fetch(init?: RequestInit) {
    const result = await fetch(this.Href, init);
    if (!result.ok) throw result;
    return await result.json();
  }
}
