# Pattern Matching

When working with `use` types. One may need to confirm what they are before working with them. This can be achieved with pattern matching. Any variable may be validated against any struct, schema, or primitive type. It is as simple as below.

```
// Please don't do this
fn text(input: use T) {
  return
    if (input is int) return input;
    else panic "I only like ints";
}
```
