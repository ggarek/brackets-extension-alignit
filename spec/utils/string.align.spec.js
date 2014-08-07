var alignString = require('./../../src/utils/string/alignString');

describe('alignString utility', function () {

  it('should align string within palceholder size using space char', function () {
    expect(alignString('James', '_', 4, 1)).toEqual('James');
    expect(alignString('Loly', '_', 10, 1)).toEqual('______Loly');
    expect(alignString('Anny', '*', 20, -1)).toEqual('Anny****************');
  });

  it('should throw when space char is incorrect are incorrect', function () {
    expect(function () { alignString('Jhony', '', 10, 1) }).toThrow();
    expect(function () { alignString('Jhony', 'asd', 10, 1) }).toThrow();
  })
});