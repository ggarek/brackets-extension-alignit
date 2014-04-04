function Parser() {
/* empty */
}

Parser.prototype.transformTokens = function transformTokens(tokens) {
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
        result += ";\n";
      } else {
        result += ",\n";
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

module.exports = Parser;