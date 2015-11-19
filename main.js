/*
 * Copyright (c) 2013 Igor Ovsyannikov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */



/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window */

/*
 * Defines "Align it!"
 * The Brackets extension which allows you to make some beautiful code alignments,
 * e.g. object literals and variable assignments
 *
 * see README for examples
 */
define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var AppInit         = brackets.getModule("utils/AppInit"),
        CommandManager  = brackets.getModule("command/CommandManager"),
        EditorManager   = brackets.getModule("editor/EditorManager"),
        Menus           = brackets.getModule("command/Menus");


    // Some extension options, hardcoded yet
    var CMD_ID            = "ggarek.alignit",
        CMD_NAME          = "Align it",
        CMD_HOTKEYS       = ["Ctrl-\\"],
        alignModes = {
            soft : 1,
            hard : 2
        },
        alignMode = alignModes.soft,
        separator = "=",
        indentInfo = {
            char : " ",
            count : 2
        },
        stringSeparators = ["\n"],
        op = Object.prototype;

    // @method Command entry point
    function run() {

        try {
            var e         = EditorManager.getFocusedEditor(),
                selection = e.getSelection();

            // IF selection is empty there is nothing to align
//            if(selectionEquals(selection.start, selection.end)){
//                return;
//            }

            // Set start and end to describe whole strings,
            // if for example selection contains only part of a string
            selection.start.ch  = 0;
            selection.end.line += 1;
            selection.end.ch    = 0;

            // Get text range
            var range = e.document.getRange(selection.start, selection.end);
            // Process text range
            var result = align(range);
            // Replace text range with processed one
            e.document.replaceRange(result, selection.start, selection.end);

        } catch (ex) {
            // how to log?
        }
    }

    // @method This guy does the main aligning job xD
    // @param {String} input Text range to align
    // @returns {String} Aligned text range
    function align(input) {

        // split lines
        var lines = input.match(/.*\n?/g),
            alignInfo = {
                // Array of entries
                entries : [],
                hasEntries : function () { return this.entries.length > 0; },
                output : ""
            },
            maxColumn = { val : 0};


        lines.forEach(function (line, i) {
            var idx = 0,
                idx1,
                idx2,
                idx3,
                messyLinesRx,
                cleaneLines,
                newSeparator,
                entry,
                newEthalonSeparatorColumn = 0;

            // Find separator
            idx1 = line.replace(/'.*?'|".*?"|\/.+\//g, '').indexOf(':');
            idx2 = line.replace(/'.*?'|".*?"|\/.+\//g, '').indexOf('=');
            idx3 = line.replace(/'.*?'|".*?"|\/.+\//g, '').indexOf(',');

            if(idx1 === -1 && idx2 === -1 && ((idx3 && /,\n$/.test(line)) || idx3 === -1)){
                newSeparator = undefined;
                if((/^\/\/|^\/\*/).test(line.replace(/\s+/g, '')) || line.replace(/\s+/, '') === '') {
                    separator = newSeparator;
                    maxColumn = { val : 0};
                }
            }else if(idx1 !== -1 && idx2 !== -1 && idx1 < idx2 || idx1 !== -1 && idx2 === -1){
                newSeparator = ':';
            }else if(idx3 !== -1 && /,\n$/.test(line) === false && idx1 === -1 && idx2 === -1){
                newSeparator = ',';
            }else{
                newSeparator = '=';
            }

            if(newSeparator === ',' && /,\n$/.test(line)){
                newSeparator = undefined;
            }

            if(!isLineValid(line)){
                return;
            }
            if(newSeparator === '=' && (line.indexOf(newSeparator) === line.indexOf('===') || line.indexOf(newSeparator) === line.indexOf('=='))){
                idx = 0;
            }else if(newSeparator !== undefined && (/^\/\/|^\/\*/).test(line.replace(/\s+/g, '')) === false){
                if(separator !== newSeparator){
                    separator = newSeparator;
                    maxColumn = { val : 0};
                }

                console.log(line.replace(/'.*?'|".*?"|\/.+\//g, '').indexOf(separator), line.indexOf(separator));
                if(line.replace(/'.*?'|".*?"|\/.+\//g, '').indexOf(separator) !== line.indexOf(separator)){
                    console.log('here');
                    idx = 0;
                }else{
                    messyLinesRx = new RegExp('\\s*([+-]*)' + separator + '\\s*');

                    if(separator === ','){
                        cleaneLines = separator+' ';
                    }else{
                        cleaneLines = ' $1'+separator+' ';
                    }

                    // on occasion the separator is padded because a variable name has been shorted.
                    line = line.replace(messyLinesRx, cleaneLines); // just the first one don't want ot mess with any strings

                    // Find separator
                    idx = line.indexOf(separator);
                }
            }else{
                idx = 0;
            }

            // Create entry to align
            entry = {
                row     : i,
                source  : line,
                separator : {
                    value   : separator,
                    column  : idx
                },
                // IF there is no separator in the line, there is no need to align it
                needAlign : idx > 0,
                maxColumn : maxColumn
            };

            if(idx > 0){
                if(separator === '=' && /\+=/.test(line)){
                    if((line.indexOf(separator) - 1) === line.indexOf('+=')){
                        entry.separator.value = '+=';
                        entry.separator.column = line.indexOf(entry.separator.value) + 1;
                    }else if((line.indexOf(separator) - 1) === line.indexOf('-=')){
                        entry.separator.value = '-=';
                        entry.separator.column = line.indexOf(entry.separator.value) + 1;
                    }
                    entry.needAlign = entry.separator.column > 0;
                }
            }

            // Add entry to array
            alignInfo.entries.push(entry);

            if (maxColumn.val < idx && idx > 0) {
                maxColumn.val =  makeMultipleOf(entry.separator.column, indentInfo.count);
            }

            if((/\{$/).test(line.replace(/\s+/g, ''))){
                separator = undefined;
                maxColumn = { val : 0};
            }
        });

        // IF there is something to align
        if (alignInfo.hasEntries()) {
            alignInfo.entries.forEach(function (entry) {
                var d,
                    alignSubString,
                    aligned;

                // Skip ethalon entry, it doesn`t need to be aligned
                // Also skip all lines where separator is in the same place as in ethalon

                // IF it is ethalon (line with most far separator position)
               if (entry.needAlign) {
                    // THEN align entry string
                    aligned = getAlignedString(alignInfo, entry);
                }
                // ELSE entry does not need aligning
                else {
                    // THEN just pass entry as is
                    aligned = entry.source;
                }

                // Append aligned string to output string
                alignInfo.output += aligned;
            });
        }

        maxColumn = { val : 0};

        return alignInfo.output;
    }

    // @method Builds aligned string
    // @param {Object} alignInfo Object containing code range aligning information
    // @param {Object} entry Object containing informatrion of single entry to align
    // @returns {String} Aligned string
    function getAlignedString(alignInfo, entry) {
        var d,
            alignSubString,
            aligned;

        d = entry.maxColumn.val - entry.separator.column;
        if(entry.separator.value === ','){
            alignSubString = entry.separator.value + repeatString(indentInfo.char, d);
        }else{
            alignSubString = repeatString(indentInfo.char, d) + entry.separator.value;
        }

        return entry.source.replace(entry.separator.value, alignSubString);
    }

    // @method Builds string repeating inpput string
    // @param {String} str String to repeat
    // @param {Number} times Times to repeat input string
    // @returns {String} String, containing input string n times
    function repeatString(str, times) {
        var base = "", res = str, i = 0;
        for (i = 0; i < times; i +=1 ) {
                base += res;
        }

        return base;
    }

    // @method Adds up input number to be multiple of multiplier
    // @param {Number} number Input number
    // @param {Number} multiplier Multiplier
    // @returns {Number}
    function makeMultipleOf(number, multiplier) {
        var modulo = number % multiplier;
        return modulo === 0 ? number : number + multiplier - modulo;
    }

    // @method Specific predicate to validate entry string
    // @param {line}
    // @returns {Boolean} True if the entry string is valid
    function isLineValid(line) {
        // I use .length instead of .trim(), because trim cuts out '\n' too
        return op.toString.call(line) === "[object String]" && line.length > 0;
    }

    // @method Checks two selections equality
    // @param {!{line:number, ch:number}} a First selection
    // @param {!{line:number, ch:number}} b Second selection
    // @returns {boolean} True if selections are equal
    function selectionEquals(a, b) {
        return a.line === b.line && a.ch == b.ch;
    }


    // Inject the command
    CommandManager.register(CMD_NAME, CMD_ID, run);
    var menu = Menus.getMenu(Menus.AppMenuBar.EDIT_MENU);
    menu.addMenuItem(CMD_ID, CMD_HOTKEYS);

    exports.align = align;
});