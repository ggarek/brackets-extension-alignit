var repeatString = require('./repeatString');

function alignString(src, spaceChar, placeholderLength, align){
  var result = '';

  if(spaceChar.length != 1){
    throw new Error('\'spaceChar\' should be single character string');
  }

  // Source string length is greater then place holder length
  // Nothing to align
  if(src.length >= placeholderLength){
    return src;
  }

  if(align < 0){
    // Align left
    result = src + repeatString(spaceChar, placeholderLength - src.length)
  } else {
   // Align right
    result = repeatString(spaceChar, placeholderLength - src.length) + src;
  }

  return result;
}

// Exports
module.exports = alignString;