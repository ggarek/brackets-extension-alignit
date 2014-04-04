/**
 * Created by user on 11.03.14.
 */

window.onload = run;

function run () {
  var input = document.getElementById("taInput"),
      output = document.getElementById("taOutput"),
      btnProcess = document.getElementById("btnProcess"),
      processor = new Processor();

  btnProcess.addEventListener("click", function () {
      output.value = processor.run(input.value);
    },
    false
  );
}

var Processor = (function () {
  function Processor() {
    this._isRunning = false;
  }

  Processor.prototype.run = function run(input) {
    var output = "";

    if(this._isRunning){
      throw new Error("Processor is busy");
    }

    this._isRunning = true;

    try{
      output = _transformTokens(_parseText(input));
    } finally {
      this._isRunning = false;
    }

    return output;
  }

  function _transformTokens(tokens) {
    var i= 0,
        result = "",
        separator = "=",
        maxLeftTokenLength = 0,
        leftTokenLength = 0;

    if((tokens.length & 1) !== 0) {
      throw new Error("Tokens length should be even");
    }

    // Find max left token length
    for(i=0; i<tokens.length; i += 2){
      if(tokens[i].length > maxLeftTokenLength) {
        maxLeftTokenLength = tokens[i].length;
      }
    }

    for(i=0; i<tokens.length; i++){
      if((i & 1) === 0){
        leftTokenLength = tokens[i].length;

        result += tokens[i];

        if(leftTokenLength < maxLeftTokenLength) {
          result += _repeatString(" ", maxLeftTokenLength - leftTokenLength);
        }
      } else {
        result += " " + separator + " " + tokens[i];

        if(i === tokens.length - 1) {
          result += ",\n";
        } else {
          result += ";\n";
        }
      }
    }

    return result;
  }

  function _repeatString(str, times) {
    var i = 0,
        result = "";

    for(i = 0; i < times; i++) {
      result += str;
    }

    return result;
  }

  function _parseText(text){
    var state = 0,
        tokens = [],
        pairCharsStack = new Stack();

    var i = 0,
        startIdx = 0,
        ch = '';

    while(i < text.length){
      ch = text.charAt(i);

      switch (state) {
        // Look for separator ('=')
        case 0:
          if(ch === '=') {
            // Close current token
            tokens.push(text.substring(startIdx, i).trim());
            startIdx = i+1;

            // Change state
            state = 1;
          }
          break;

        // Look for end char (',', '\n', ';')
        case 1:
          if(ch === ',' || ch === ';' || ch === '\n') {
            // Close current token
            tokens.push(text.substring(startIdx, i).trim());
            startIdx = i+1;

            // Change state
            state = 0;
          } else if (ch === "\"" || ch === "'" || ch === "{") {
            pairCharsStack.push({ state: 1, char: ch, closeChar: _getCloseChar(ch) });

            // Change state
            state = 2;
          }
          break;

        // Look for paired char
        case 2:
          if(ch === pairCharsStack.peek().closeChar) {
            var prevState = pairCharsStack.pop();

            // Change state to previous
            state = prevState.state;
          } else if (ch === "\"" || ch === "'" || ch === "{") {
            pairCharsStack.push({ state: 2, char: ch, closeChar: _getCloseChar(ch) });

            // State in this state
          }
          break;
      }

      // Increment only here
      i++;
    }

    return tokens;
  }

  function _getCloseChar(ch) {
    switch (ch) {
      case '{': return '}';
      case '"': return '"';
      case '': return '\'';
    }
  }

  return Processor;
}());
var Stack = (function () {
  function Stack(){
    /* empty */
  }

  Stack.prototype = new Array();

  Stack.prototype.peek = function peek () {
    return this.length > 0 ? this[this.length-1] : undefined;
  }

  Stack.prototype.constructor = Stack;

  return Stack;
}());