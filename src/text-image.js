/**
 * TextImage
 * @param  {[type]} document [description]
 * @param  {[type]} window   [description]
 * @return {[type]}          [description]
 */
module.exports = function (document, window) {

  var 
    fs = require('fs'),
    pre = document.createElement('pre'),
    canvas = document.createElement('canvas'),
    context = canvas.getContext('2d'),
    _style = {
        font: 'Sans-serif',
        align: 'left',
        color: '#000000',
        size: 16,
        background: 'rgba(0, 0, 0, 0)',
        stroke: 0,
        strokeColor: '#FFFFFF',
        lineHeight: Math.ceil(16 * 1.2),
        bold: false,
        italic: false
    },
    preStyle = ';padding: 10x; display: block; position: fixed; top: 100%; overflow: hidden;',
    TextImage,
    fn;

  TextImage = function(style) {
    if (!(this instanceof TextImage)) {
      return new TextImage(style);
    }
    this.setStyle(style);
    return this;
  }

  TextImage.prototype.setStyle = function (style) {
      this.style = style || {};
      
      this.style.paddingTop = 0
      this.style.paddingLeft = 0

      for (var key in _style) {
          if (!this.style[key]) {
              this.style[key] = _style[key];
          }
      }
      this._style = 'font: ';
      if (this.style.italic) {
          this._style += 'italic ';
      }
      if (this.style.bold) {
          this._style += 'bold ';
      }
      this._style +=  this.style.size + 'px ' + this.style.font + ';';
      this._style += 'line-height:' + Math.ceil(this.style.size * 1.2) + 'px;';
      this._style += 'text-align: ' + this.style.align + ';';
      this._style += 'color: ' + this.style.color + ';';
      this._style += 'background-color: ' + this.style.background + ';';
      this._style += preStyle;
      return this;
  }

  TextImage.prototype.setPadding = function (x, y) {
    this.style.paddingLeft = x
    this.style.paddingTop = y
  },

  TextImage.prototype.toDataURL = function (message) {
      if (message) {
          convert.call(this, message);
      }
      return canvas.toDataURL();
  }

  TextImage.prototype.toImage = function (message, callback) {
      convert.call(this, message);
      var img = new Image();
      if (callback) {
          img.onload = callback;
      }
      img.src = canvas.toDataURL();
      return img;
  }

  TextImage.prototype.toFile = function(message, filename, callback) {
    convert.call(this, message);

    var img = new Image();
    img.src = canvas.toDataURL();
    var data = img.src.replace(/^data:image\/\w+;base64,/, "");

    var buf = new Buffer(data, 'base64');
    fs.writeFile(filename, buf, function(err, d){
      if (err) throw err
      if(callback)
        callback()
    });
  }

  function getLongestSize(lines) {
    var i,
      max = 0,
      index = -1;
    for(i in lines) {
      if(lines[i].length > max) {
        index = i
        max = lines[i].length
      }
    }
    return lines[index].length
  }

  function convert(message) {
    /**
     * context reference
     * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
     */
    message = String(message);
    message = message.replace(/\\n/g, "\n")
    
    pre.innerHTML = message;
    pre.innerText = message;
    pre.setAttribute('style', this.style);
    
    document.body.append(pre);
    var lines = message.split('\n'),
        x = this.style.stroke,
        y = pre.offsetHeight / lines.length || this.style.size,
        paddingTop = this.style.paddingTop || 2 * this.style.size, 
        paddingLeft = this.style.paddingLeft || paddingTop,
        base = y * 0.1,
        offset;

    canvas.width = pre.offsetWidth + (getLongestSize(lines) * (this.style.size * 0.6));
    canvas.height = this.style.lineHeight * lines.length;

    canvas.width += 2 * paddingLeft
    canvas.height += 2 * paddingTop

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = this.style.background;
    context.beginPath();
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fill();

    var context_font = '';
    if(this.style.italic) {
      context_font += 'italic ';
    }
    if(this.style.bold) {
      context_font += 'bold ';
    }

    // append size, font
    context_font += this.style.size + 'px ' + this.style.font;
    context.font = context_font;
    context.textAlign = this.style.align;
    context.lineWidth = this.style.stroke;
    context.strokeStyle = this.style.strokeColor;
    context.fillStyle = this.style.color;
    switch (context.textAlign) {
      case 'center':
        x = canvas.width / 2;
        break;
      case 'right':
        x = canvas.width - (x + paddingLeft);
        break;
      case 'left':
        x = x + paddingLeft;
        break;
    }

    // Leave space at the top: 
    // `total height minus the height of the text, --divided by two--`
    offset = (canvas.height - ((y) * lines.length))

    lines.forEach(function(line, i) {
      if(this.style.stroke > 0) {
        context.strokeText(line, x, y * (i + 1) - base);
      }
      context.fillText(line, x, offset + (y * (i + 1) - base));
    }.bind(this));

    // add text to context
    context.fill();
    document.body.removeChild(pre);
  }

  window.TextImage = TextImage
  return TextImage
}
