/**
 * Created by user on 11.03.14.
 */

var fs = require("fs");

// Constants
var INPUT_TOKEN = "#input",
    OUTPUT_TOKEN = "#output";

// States
var STATE_INITIAL = 0,
    STATE_READING_INPUT = 1,
    STATE_READING_OUTPUT = 2;

function InputReader() {
  /* empty */
}

InputReader.prototype.getInput = function getInput(path) {
  var lines = fs.readFileSync(path, 'utf8').split('\n'),
      state = STATE_INITIAL,
      subResult = "",
      data;

  // Synced arrays
  data = { inputs: [], outputs: []};

  lines.forEach(function (line) {
    line = line.trim();

    switch (state) {
      case STATE_INITIAL:
        if(line === "") {
          // skip
        } else if (line === INPUT_TOKEN) {
          state = STATE_READING_INPUT;
        } else {
          throw new Error ("state: INITIAL, wrong input: " + line + " -> Input keyword '#input' expected");
        }
        break;

      case STATE_READING_INPUT:
        if(line === OUTPUT_TOKEN) {
          // "Flush" result
          data.inputs.push(subResult);
          subResult = "";

          state = STATE_READING_OUTPUT;
        } else {
          subResult += line + "\n";
        }
        break;

      case STATE_READING_OUTPUT:
        if(line === INPUT_TOKEN) {
          // "Flush" result
          data.outputs.push(subResult);
          subResult = "";

          state = STATE_READING_INPUT;
        } else {
          subResult += line + "\n";
        }
        break;
    }
  })

  if(state !== STATE_READING_OUTPUT) {
    throw new Error("Wrong input file format. Last section should be sections after '#output' keywords");
  }

  // "Flush" result
  data.outputs.push(subResult);
  subResult = "";

  // check post conditions
  if(data.inputs.length !== data.outputs.length){
    throw new Error([
      "Violation of post condition:",
      " data.inputs and data.outputs should be synced arrays",
      " thus their length should match.",
      "->\n\tdata.input.length=" + data.inputs.length,
      "->\n\tdata.outputs.length=" + data.outputs.length
    ].join(""));
  }

  // Return data
  return data;
};

module.exports = InputReader;