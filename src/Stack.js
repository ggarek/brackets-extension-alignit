function Stack(){
  /* empty */
}

Stack.prototype = new Array();

Stack.prototype.peek = function peek () {
  return this.length > 0 ? this[this.length-1] : undefined;
}

Stack.prototype.constructor = Stack;

module.exports = Stack;