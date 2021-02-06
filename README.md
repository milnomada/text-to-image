# Text to Image

Node.js module to generate images with arbitrary text and colors  
Ported from [text-edit](https://github.com/zonayedpca/text-image) and modified to run image render process as a backend application, including all necessary dom management libraries the web browser provides to front end application.

## Dependencies
It makes use of document and window from [jsdom](https://github.com/jsdom/jsdom) project.  
For the `offline` image render, it draws on [canvas](https://github.com/Automattic/node-canvas), the jsdom module understands that
canvas is loaded in the project.  
See more about jsdom canvas integration [here](https://github.com/jsdom/jsdom#canvas-support).  

```bash
npm i jsdom
npm i canvas
```

## Install
Use this git project install:

```bash
npm i git+https://git@github.com/milnomada/text-to-image.git
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
var TextImage = require('text-to-image')(document, window)
```

## Style

The rendered image can be customized in several ways

### Font

As text-to-image works with an input canvas component, it can be customized before it is sent to the image renderer.
In node-canvas, there is a method useful to add fonts to the canvas renderer [registerFont](https://github.com/Automattic/node-canvas#registerfont).  

Having ttf fonts locally donwloaded to the `./fonts` folder,  a simple example on how to add a font:

```js
const jsdom = require('jsdom')
const canvas = require('canvas')
const { registerFont, createCanvas } = require('canvas')
const { JSDOM } = jsdom;

// done before loading jsdom
registerFont('fonts/OdibeeSans-Regular.ttf', { family: 'Odibee' })

var dom = new JSDOM(`<html><head><meta charset='utf-8'></head><body><p>Hello world</p></body></html>`);

global.window   = dom.window;
global.document = dom.window.document;
global.Image    = window.Image;
global.Node     = window.Node;

var TextImage = require('text-to-image')(document, window)
var style = {
  font: 'Odibee',
  align: 'center',
  ...
}
textImage1 = TextImage(style)
```

### Colors

```js
var style = {
    color: 'rgb(23, 134, 67)',
    background: '#ffffff',
    strokeColor: 'rgba(0, 0, 0, 0)',
    ...
  }
```

### General Settings

Other configurable style properties:

```js
var
  fontSize = 18,
  style = {
    font: 'serif',
    align: 'center',
    color: 'red',
    background: 'white',
    size: fontSize,
    lineHeight: Math.ceil(fontSize * 1.2),
    stroke: 1,
    strokeColor: 'rgba(0, 0, 0, 0)',
    bold: true,
    italic: true
  },
  textImage1 = TextImage(style),
  text = "This is\na\nhighly customized\ntext image"
  ;

textImage1.setStyle(style);
textImage1.toFile(text, "test.png");
```
