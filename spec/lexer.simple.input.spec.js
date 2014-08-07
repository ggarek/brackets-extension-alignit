var Lexer = require("./../src/Lexer");

describe('Lexer tokenize operation', function () {
  it('should parse simple input correct', function () {
    var lexer = new Lexer(),
        input = [],
        tokens = null;    
    
    input = [
      { data: 'three="t,h;r\ne{e";', tokens: 2 },
      { data: 'a=123123123;', tokens: 2 },
      { data: 'hello_my_friend_who_are_you   = "ada222asdasd"', tokens: 2 },
      { data: 'iam892_   = "ada222a{asdsdasd"', tokens: 2 },
    ];

    input.forEach(function (el) {
      tokens = lexer.tokenize(el.data)
      expect(tokens.length).toEqual(el.tokens);
    });

  });
});