var repeatString = require('./../../src/utils/string/repeatString');

describe('repeatString utility', function () {
  it('should repeat given string N times', function () {
    var data = [' ', '_', 'abc', '**'];

    data.forEach(function (str) {
      expect(repeatString(str, 5)).toEqual([str, str, str, str, str].join(''));
      expect(repeatString(str, 1)).toEqual([str].join(''));
      expect(repeatString(str, 0)).toEqual('');
      expect( function () { return repeatString(str, -1); }).toThrow();
    });
  });
});