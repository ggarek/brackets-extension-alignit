var InputReader = require("./data/InputReader"),
    Lexer = require("./../src/Lexer"),
    Parser = require("./../src/Parser");

function readAndParse(path){
  var reader = new InputReader(),
    lexer = new Lexer(),
    parser = new Parser(),
    i = 0,
    data,
    transformResult = "",
    tokens = null;

  data = reader.getInput(path);
  for(i=0; i<data.inputs.length; i++) {
    tokens = lexer.tokenize(data.inputs[i])
    transformResult = parser.transformTokens(tokens);

    expect(transformResult).toEqual(data.outputs[i]);
  }
}

describe('Parser and lexer', function () {
  it('should provide correct output for input#1', function () {
    var reader = new InputReader(),
        lexer = new Lexer(),
        parser = new Parser(),
        i = 0,
        data,
        transformResult = "",
        tokens = null;

    data = reader.getInput("./spec/data/input#1");
    for(i=0; i<data.inputs.length; i++) {
      tokens = lexer.tokenize(data.inputs[i])
      transformResult = parser.transformTokens(tokens);

      expect(transformResult).toEqual(data.outputs[i]);
    }
  });

  it('should provide correct output for input#2', function () {
    readAndParse("./spec/data/input#2");
  });
});
