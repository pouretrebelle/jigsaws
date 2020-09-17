# Jigsaw Design IDE

A development environment for [abstractpuzzl.es](http://abstractpuzzl.es/) jigsaw design

![Screenshot of interface](/screenshot.png?raw=true)

### Features

- All designs use [simplex-noise](https://www.npmjs.com/package/simplex-noise) with 3 letter seeds for randomness, so every state can be recreated
- Exports SVGs for laser cutting, high definition PNGs for printing, and WEBM animations
- Intuitive interface with zoom functionality

## :raised_hands: Development

- `npm install` installs all the site's dependencies
- `npm start` runs dev mode on [localhost:8080](http://localhost:8080)

## :construction_worker: Being good

- We use [Typescript](https://www.typescriptlang.org/) for type checking
- We use [Prettier](https://prettier.io/) for consistent code styling, set it up for your editor with [these instructions](https://prettier.io/docs/en/editors.html) to run on file save
