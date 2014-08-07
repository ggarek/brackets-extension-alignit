module.exports = function repeatString(str, times) {
  var i = 0,
    result = "";

  if(times < 0){
    throw new Error('Parameter times should be not negative number');
  }

  for(i = 0; i < times; i++) {
    result += str;
  }

  return result;
}
