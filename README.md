# moviz

> moviz client version

Try [`Online Demo`](https://hconhisway.github.io/moviz-client/#/).

## Environment Setup

* node.js version: 20.1.0
* npm version: 9.6.4
* vue version: 2.5.2
* others can be found at package.json

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Data

Currently Moviz is fetching data(the json file) directly from [`skema`](https://github.com/ml4ai/skema/tree/main) repository.

## Algorithm

Todo

## Bugs to Fix

Please click on the nodes of the same layer from top to bottom, otherwise the layout order will be wrong. This is a bug that needs to be fixed by modifying the tree layout algorithm.