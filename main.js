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
            if(selectionEquals(selection.start, selection.end)){
                return;
            }

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
                // The most far separator position found among all line entries
                maxColumn : 0,
                // Ethalon entry
                ethalon : null,
                // Array of entries
                entries : [],
                hasEntries : function () { return this.entries.length > 0; },
                output : ""
            },
            idx1,
            idx2,
            messyLinesRx,
            cleaneLines;

        // Find separator
        idx1 = lines[0].replace(/'.*'|".*"/g, '').indexOf(':');
        idx2 = lines[0].replace(/'.*'|".*"/g, '').indexOf('=');

        if(idx1 === -1 && idx2 === -1){
            separator = '=';
        }else if(idx1 !== -1 && idx2 !== -1 && idx1 < idx2 || idx1 !== -1 && idx2 === -1){
            separator = ':';
        }else{
            separator = '=';
        }

        messyLinesRx = new RegExp('\\s*' + separator + '\\s*');
        cleaneLines = ' '+separator+' ';

        lines.forEach(function (line, i) {
            var idx = 0,
                entry,
                newEthalonSeparatorColumn = 0;

            // Skip invalid lines
            if (!isLineValid(line)) {
                return;
            }

            // on occasion the separator is padded because a variable name has been shorted.
            line = line.replace(messyLinesRx, cleaneLines); // just the first one don't want ot mess with any strings

            // Find separator
            idx = line.indexOf(separator);

            // Create entry to align
            entry = {
                row     : i,
                source  : line,
                separator : {
                    value   : separator,
                    column  : idx
                },
                // IF there is no separator in the line, there is no need to align it
                needAlign : idx > 0
            };

            // Add entry to array
            alignInfo.entries.push(entry);

            // Update ethalon entry (Ethalon entry is an entry with the far most separator)
            if (!alignInfo.ethalon || alignInfo.ethalon.separator.column < idx) {
                alignInfo.ethalon = entry;
                alignInfo.maxColumn = alignInfo.ethalon.separator.column;
            }

        });

        // IF there is something to align
        if (alignInfo.hasEntries()) {
            // Update the most far separator column, so that it is multiple of indentInfo.count
            alignInfo.maxColumn = makeMultipleOf(alignInfo.maxColumn, indentInfo.count);

            alignInfo.entries.forEach(function (entry) {
                var d,
                    alignSubString,
                    aligned;

                // Skip ethalon entry, it doesn`t need to be aligned
                // Also skip all lines where separator is in the same place as in ethalon

                // IF it is ethalon (line with most far separator position)
                if (entry === alignInfo.ethalon) {
                    // AND ethalon separator position is less then max separator position
                    if (alignInfo.maxColumn > entry.separator.column) {
                        // THEN align ethalon string
                        aligned = getAlignedString(alignInfo, entry);
                    } else {
                        // Pass ethalon string as is
                        aligned = entry.source;
                    }
                }
                // ELSE IF entry contains separator and needs aligning
                else if (entry.needAlign && entry.separator.column < alignInfo.maxColumn) {
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

        d = alignInfo.maxColumn - entry.separator.column;
        alignSubString = repeatString(indentInfo.char, d) + entry.separator.value;
        return entry.source.replace(entry.separator.value, alignSubString);
    }

    // @method Builds string repeating inpput string
    // @param {String} str String to repeat
    // @param {Number} times Times to repeat input string
    // @returns {String} String, containing input string n times
    function repeatString(str, times) {
        var base = "", res = str, i = 0;
        for (i = times; i > 1; i >>= 1) {
            if (i & 1) {
                base += res;
            }

            res += res;
        }

        return res + base;
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