# Text to Image

Utility to generate images with text  
Ported from [text-edit](https://github.com/zonayedpca/text-image) and modified to render images server side using node.js libs  

## Dependencies
It accepts document and window from [jsdom](https://github.com/jsdom/jsdom)  
It makes use of [canvas](https://github.com/Automattic/node-canvas) so jsdom makes use of it when loading the Image

```bash
npm i jsdom
npm i canvas
```

## Install
Use this git project install:

```bash
npm i git+https://git@github.com/milnomada/text-image.git
```

## Usage

Recommended setup:  

```js
const jsdom = require('jsdom')
const canvas = require('canvas')

const { JSDOM } = jsdom;
var dom = new JSDOM(`<html><head><meta charset='utf-8'></head><body><p>Hello world</p></body></html>`);

global.window   = dom.window;
global.document = dom.window.document;
global.Image    = window.Image;
global.Node     = window.Node;

// create new TextImage object
var TextImage = require('text-image')(document, window)
```


