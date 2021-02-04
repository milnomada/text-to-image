const jsdom = require('jsdom')
const canvas = require('canvas')
const { registerFont, createCanvas } = require('canvas')
const { JSDOM } = jsdom;

var dom = new JSDOM(`<html><head><meta charset='utf-8'></head><body><p>Hello world</p></body></html>`);
global.window   = dom.window;
global.document = dom.window.document;
global.Image    = window.Image;
global.Node     = window.Node;


// create new TextImage object
var TextImage = require('./src/text-image')(document, window)

var style = {
    font: 'serif',
    align: 'center',
    color: 'black',
    background: 'white',
    size: 70,
    lineHeight: Math.ceil(70 * 1.2),
    stroke: 1,
    strokeColor: 'rgba(0, 0, 0, 0)',
    bold: true,
    italic: true
  },
  textImage1 = TextImage(style),
  text = "some\ngood\nnews"
  ;

textImage1.setStyle(style);
textImage1.toFile(text, "test.png");
