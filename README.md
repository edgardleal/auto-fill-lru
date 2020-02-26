
# auto-fill-lru

> A LRU cache with a provider function to auto-cache itens

![Build CI](https://github.com/edgardleal/auto-fill-lru/workflows/Build%20CI/badge.svg)

## Installing

```
npm install auto-fill-lru
```

## Examples

```js

function slowFunction(key) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(100), 1000);
  });
}

const instance = new LRU({
  retrieveFunction: slowFunction,
});

result = await intance.get('1'); // return after 1s

result2 = await instance.get('1'); // return imediatly
```
