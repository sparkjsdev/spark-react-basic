# React Basic

A basic example of using Spark in a React app. This example does not use any additional libraries like React Three Fiber. It initalizes a WebGL context and renderer attached to a `<canvas>` element created declaratively in React, and it creates a basic scene with a camera, a renderer, and a splat mesh. The renderer is created inside a callback ref attached to a canvas element (one could also use `useEffect`).

## Running the example

First, download the assets:

```bash
npm run assets:download
```

Then, run the development server:

```bash
npm install
npm run dev
```

## Using Webpack

> [!IMPORTANT]
> This example uses Vite as the bundler. There is an issue with Spark and Webpack where the WASM URL is not properly resolved. If you are using Webpack, you can apply the following configuration to your `webpack.config.js` file:
>
> ```js
> module.exports = {
>   module: {
>     parser: {
>       javascript: {
>         url: false, // disable parsing of `new URL()` syntax
>       },
>     },
>   },
> };
> ```
