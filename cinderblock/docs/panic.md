# Panic

When something has gone wrong beyond repair. The `panic` keyword may be used. This will immediatly terminate the process after posting the supplier char array to the stdio. This should not be used like throwing exceptions. If a handleable error has occurd, simply return an error object from the function.

Use the panic keyword in scenarios where continueing the process would cause harm to the system. This is not something that will be seen in day to day code but may have value when working with highly precise systems.

```
fn test() {
  panic "Why are you calling me?";
}
```