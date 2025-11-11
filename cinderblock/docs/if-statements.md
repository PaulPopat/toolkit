# If Statements

If statments use standard C syntax but, like all blocks in Cinderblock, they must return a value. This means that all if statements must be accompanied by an else statement. As an if statement is declared within a proceedural flow (within a function) it must be followed by a semi colon.

```
fn test(input: bool): int {
  result -> if (input) {
    return 123;
  } else {
    return 456;
  };

  return result;
}
```

If statements may also be used without declaring a block for each part. If so, each part must be followed by a semi colon and only one statement is allowed per part;

```
fn test(input: bool): int {
  result ->
    if (input) return 123;
    else return 456;

  return result;
}
```