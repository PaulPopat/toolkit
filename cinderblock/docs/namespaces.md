# Namespaces

All code in an Cinderblock project must be within a namespace. They are declared like so.

```
namespace TestNamespace {
  // Function and Struct declarations go here
}
```

Code within a namespace may then be called with:

```
TestNamespace.test(123, false);
```

A namespace may also be used within another namespace. This may be done with:

```
namespace OtherNamespace {
  using TestNamespace;

  fn some_function(): int {
    return test(123, false);
  }
}
```

When exposing an entity of a namespace to be used outside the namespace, the `export` keyword may be used.

```
namespace OtherNamespace {
  export fn some_function(): int {
    return 123;
  }
}
```
