var stringUtils = require('./utils/string/index');

function AlignGroupTransformer() {

}

AlignGroupTransformer.prototype = {
  transform: function transform(group) {
    var h1,
        h2,
        output = '';

    // h1 anchor of the first element is the leading anchor for left part alignment within the group
    h1 = group.items[0].h1;
    // h2 anchor is the max length among all items left parts
    h2 = group.items.reduce(function (acc, cur) { return acc < cur.left.length ? cur.left.length : acc }, 0);

    output += group.openChar;
    group.items.forEach(function(item, i) {
      var itemStr = stringUtils.align(item.left, ' ', h2, -1) + ' ' + group.separator + ' ' + item.right,
          offsetString = item.h0 >= 0 ? stringUtils.repeat(' ', item.h0) : '';

      if(i == 0){
        output +=  offsetString + itemStr + group.itemEnding;
      } else {
        output += offsetString + itemStr + (i + 1 < group.items.length ? group.itemEnding : group.finalItemEnding);
      }

      if(i + 1 < group.items.length){
        output += '\n';
      }
    });
    output += '\n' + group.closeChar;

    return output;
  }
};

function alignString(src, spaceChar, placeholderLength, align){

}

function alignString(string, spaceChar, placeholderLength, align, offset){

}

module.exports = AlignGroupTransformer;