export function js_string(args: Record<string, any>, snippet: string) {
  return new Function(...Object.keys(args), `return ${snippet.replace(":", "")}`)(
    ...Object.keys(args).map((k) => args[k])
  );
}
