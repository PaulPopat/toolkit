# External

Cinderblock may expose functions to external code when writing a library and may also call external code for when linking external libraries. Note that all external dependencies and exports must operate on C compatible types.

```
namespace Test {
  lib "my_c_library" {
    fn my_c_function(x: int): bool;
  }
}
```

This will attempt to import a C library, either an so or dll, depending on the OS. All of the functions declared will by inserted into the Test namespace.

```
namespace Test {
  system {
    fn system_function(x: int): bool;
  }
}
```

This will attempt to link a system function, i.e. a operating system function. Anything declared in the system block will be placed in the Test namespace.

By default, none of these resources will be exported from the namespace. It is encouraged to wrap these functions in a more Cinderblock idiomatic wrapper before exporting but they may also be exported with the `export` keyword.

```
namespace Test {
  export lib "my_c_library" {
    fn my_c_function(x: int): bool;
  }

  export system {
    fn system_function(x: int): bool;
  }
}
```

Each item will be added to the namespace individually so will conflict if any other items of the same name are present.

```
export namespace Test {
  export fn my_exported_function(x: int): bool {
    return x == 0;
  }
}
```

This will expose the function when compiling to a dll or so object.
