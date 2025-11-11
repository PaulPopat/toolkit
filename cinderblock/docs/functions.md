# Functions

Functions are declared with the following syntax.

```
fn test(arg1: int, arg2: bool): char {
  // Function body goes here
}
```

A function may then be called with:

```
test(123, false);
```

A function may only be declared at the namespace scope but a function may be partially invoked at any point in the code with:

```
bound_test -> test(false);
```

This function may then be called as before:

```
bound_test(123);
```

Functions may also be invoked as a method of the first argument.

```
123.test(false);
```

This is useful for making fluent APIs. This may only be done when using the namespace that contains the function. If more than one of the used namespaces expose the same function signature then an ambiguous function invokation will be declared at compile time. This must either be resolved by using the full function invokation with namespace or by binding the function to a new name. This can be done like so.

```
// Option 1
Namespace.test(123, false);

// Option 2
desired_test -> Namespace.test();
123.desired_test(false);
```

Like all blocks in Cinderblock, a function must return a value.

## Lambdas

Lambdas may be store as variables. They may also be passed in the place of functions. Lambdas take a full snapshot of the scope at the time of creation until the end of their life, so be careful when returning a lambda from a function.

A lambda may not have a body. It should be treated like the right side of a store statement. Whatever is declared will be returned.

The return type of a lambda will also be inferred from what is resolved from the statement.

```
fn test(input: (input: int) -> int): int {
  return input(10);
}

// Returns 20
fn user(): int {
  return test(fn (input: int) -> input + 10)
}
```

If a lambda is being passed into a function, rather than stored. The parameter types may be inferred from the function it is being passed into.

```
fn test(input: (input: int) -> int): int {
  return input(10);
}

// Returns 20
fn user(): int {
  return test(fn (input) -> input + 10)
}
```

## As Types

Functions may be used as a type like so:

```
fn test(part: (int, bool) -> int): int {
  return 123.part(false);
}

fn test(part: (int, bool) -> int): int {
  return part(123, false);
}
```

Any function, lambda, or bound function can then be passed to the function. All functions may be used as function pointers.

## Inference

When declaring a function, the return type may be inferred by what is returned in return statements.

```
// Is the same as fn test(): int
fn test() {
  return 123;
}
```

### Use Types

Any parameters may also use the keyword `use` for their type. This type may then not be used until it has been pattern matched. It may be used in a return statement, and each invokation of a function will then use the type inputted to that variable as the return type.

```
fn test(input: use T) {
  return input;
}

fn other() {
  // var has type int
  var -> test(123);
  return var;
}
```

or

```
fn test(input: () -> use T) {
  return input();
}

fn other() {
  // var has type int
  var -> test(() -> 123);
  return var;
}
```

Finally

```
fn select(self: [use any = T], selector: (input: T) -> use any = R) {
  return iterate (self as item) return item.selector();
}

fn test(): [int] {
  indexer -> 0;
  result -> while (indexer < 10) {
    indexer += 1;

    return indexer;
  };

  return result.select((i) -> i + 2);
}
```

The use keyword may also be used within a inline schema of a function.

```
struct User {
  username: [char];
  last_activity: int;
}

fn get_activity(
  target: schema {
    last_activity: use any = T;
  }
): bool {
  return target.last_activity;
}

fn main(): int {
  tester -> make User {
    assign username = "Test User";
    assign last_activity = 5;
  }

  // This is of type int
  is_active -> tester.get_activity();

  return 0;
}
```

#### Use constraints

If a use type should only be of a smaller group of types. It may be declared like so.

```
fn test(input: use int | bool = T) {
  return input;
}

fn other() {
  // var has type int
  var -> test(123);

  /* Will not compile "type of '[char]' is not compatible with type 'int | bool'" */
  test -> test("123");

  return var;
}
```
