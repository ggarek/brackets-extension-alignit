var Stack = require("./Stack");


function Lexer () {
/* empty */
}

Lexer.prototype.tokenize = function tokenize(text){
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
          state = (ch === '\'' || ch === '"') ? 3 : 2;
        }
        break;

      // Look for closing(paired) char
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

      // Look for closing " or '
      case 3:
        // If char is ' or " end previous char is not escape char
        if((ch === '\'' || ch === '"') && i > 0 && text.charAt(i-1) !== "\\") {
          if(ch === pairCharsStack.peek().closeChar) {
            var prevState = pairCharsStack.pop();

            // Change state to previous
            state = prevState.state;
          }
        }
        break;
    }

    // Increment only here
    i++;
  }

  // If still loking for end char, then last token was not closed
  if(state === 1) {
    // THEN close it
    tokens.push(text.substring(startIdx, i).trim());
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

module.exports = Lexer;