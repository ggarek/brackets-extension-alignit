var AlignGroupTransformer = require('../src/AlignGroupTransformer');

var mockLiteralGroup = {
  separator: ':',
  openChar: '{\n',
  closeChar: '}',
  itemEnding: ',',
  finalItemEnding: '',
  items: [
    {
      left: 'name',
      right: '\'John\'',
      h0: 4,
      h1: 0
    },
    {
      left: 'age',
      right: '32',
      h0: 4,
      h1: 0
    },
    {
      left: 'gender',
      right: '\'male\'',
      h0: 4,
      h1: 0
    },
    {
      left: 'race',
      right: '\'darkelf\'',
      h0: 4,
      h1: 0
    },
    {
      left: 'occupation',
      right: '\'assassin\'',
      h0: 4,
      h1: 0
    }
  ],

  // For TEST
  transformResult : [
    '{\n',
    '    name       : \'John\',\n',
    '    age        : 32,\n',
    '    gender     : \'male\',\n',
    '    race       : \'darkelf\',\n',
    '    occupation : \'assassin\'\n',
    '}'
  ].join('')
};

var mockVarDecalrationGroup = {
  separator: '=',
  openChar: 'var ',
  closeChar: '',
  itemEnding: ',',
  finalItemEnding: ';',
  items: [
    {
      left: 'name',
      right: '\'John\'',
      h0: 0,
      h1: 0
    },
    {
      left: 'age',
      right: '32',
      h0: 4,
      h1: 0
    },
    {
      left: 'gender',
      right: '\'male\'',
      h0: 4,
      h1: 0
    },
    {
      left: 'race',
      right: '\'darkelf\'',
      h0: 4,
      h1: 0
    },
    {
      left: 'occupation',
      right: '\'assassin\'',
      h0: 4,
      h1: 0
    }
  ],

  // For TEST
  transformResult : [
    'var name       = \'John\',\n',
    '    age        = 32,\n',
    '    gender     = \'male\',\n',
    '    race       = \'darkelf\',\n',
    '    occupation = \'assassin\';\n'
  ].join('')
}

describe('AlignGroupTransformer transform', function () {

  it('should transform literal group correctly', function () {
    var agt = new AlignGroupTransformer();
    expect('\n' + agt.transform(mockLiteralGroup)).toEqual('\n' + mockLiteralGroup.transformResult);
  });

  it('should transform variable declaration group correctly', function () {
    var agt = new AlignGroupTransformer();
    debugger;
    expect('\n' + agt.transform(mockVarDecalrationGroup)).toEqual('\n' + mockVarDecalrationGroup.transformResult);
  });
});