# Schemas

Schema are similar to structs but they may have no concrete implementation. They may, however, be used as arguments to functions.

```
struct User {
  username: [char];
  last_activity: int;
}

schema ActivityData {
  last_activity: int;
}

fn is_active(target: ActivityData, now: int): bool {
  return target.last_activity >= now - 7;
}

fn main(): int {
  tester -> make User {
    assign username = "Test User";
    assign last_activity = 5;
  }

  is_active -> tester.is_active(12);

  return 0;
}
```

Schemas may also be declared inline as a function parameter.

```
struct User {
  username: [char];
  last_activity: int;
}

fn is_active(
  target: schema {
    last_activity: int;
  },
  now: int
): bool {
  return target.last_activity >= now - 7;
}

fn main(): int {
  tester -> make User {
    assign username = "Test User";
    assign last_activity = 5;
  }

  is_active -> tester.is_active(12);

  return 0;
}
```
