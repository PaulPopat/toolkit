# Loops and Iterators

## Iterators

Iterators are sequences of data. Those sequences are retrieved upon request. In the case of iterators made within code, the code for the next item is only run upon request. In the case of arrays, the next request will simply pull the data from the memory address of the next item.

Iterators of a type are declared by putting a pair of square brackets after the type name.

## Contatination

Iterators may be contatinated together with the `++` operator.

## Loops

Like all over blocks in Cinderblock. Loops must return a value. That value will be an iterator. Each iteration of the loop will only be run when the next item of that loop is requested. As such, loops are not actually run when declared, but the scope of the function will be preserved until the iterator is finished.

## Count Loops

Count loops are for when you want to perform an operation for a fixed number of times. We avoid for loops because they break principles of purity. Instead a count loop will supply an index with the name provided on the right side of the `as` keyword. The count loop is not technically pure but will suffice in order to allow generative code.

```
// Returns 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
fn test(): [int] {
  result -> count (10 as index) {
    return index;
  };

  return result;
}
```

## Iterator Loops

Iterator loops are designed to iterate over other iterators. Otherwise they work much the same way as a while loop.

```
// Returns 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
fn test(): [int] {
  iterator -> count (10 as index) {
    return index;
  };

  result -> iterate (iterator as item) {
    return item + 1;
  };

  return result;
}
```

## Reducer Loops

Reducer loops are designed to iterate over other iterators and produce an aggrigated result. A second expression is provided for the aggregator initialiser.

```
// Returns 55
fn test(): int {
  iterator -> count (10 as index) {
    return index;
  };

  return reduce (iterator as item with 0i as current) {
    return current + item;
  }
}
```

## Contatination

Iterators may be contatinated together with the `++` operator.

```
// Returns 110
fn test(): int {
  iterator1 -> count (10 as index) {
    return index;
  };
  iterator2 -> count (10 as index) {
    return index;
  };

  return reduce (iterator1 ++ iterator2 as item with 0i as current) {
    return current + item;
  }
}
```

## Next

When wanting to ignore an item in an iterator loop and move on to the next, returning the `next` keyword will tell the engine to run the loop again with the next value before continueing the execution.
