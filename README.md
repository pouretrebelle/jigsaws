# Artwork

Development environment for generative art.

![Screenshot of interface](/screenshot.png?raw=true)

### Features

- All designs use [simplex-noise](https://www.npmjs.com/package/simplex-noise) with 3 letter seeds for randomness, so every state can be recreated
- Exports SVGs for laser cutting, high definition PNGs for printing, and WEBM animations
- Intuitive interface with zoom functionality

## :raised_hands: Development

- `npm install` installs all the site's dependencies
- `npm run ide` runs the IDE on [localhost:4100](http://localhost:4100)

## :construction_worker: Being good

- We use [Typescript](https://www.typescriptlang.org/) for type checking
- We use [Jest](https://jestjs.io/) for unit tests
- We use [Prettier](https://prettier.io/) for consistent code styling with a [Husky](https://typicode.github.io/husky/) pre-commit hook
