module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-jasmine-node');

  var docsDir = './docs';
  var tmpDir  = './tmp';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: [docsDir, tmpDir],

    jasmine_node: {
      specFolders: ['./spec'],
      specNameMatcher: "spec", // load only specs containing specNameMatcher
      projectRoot: "./src",
      useCoffee: false,
      forceExit: true,
      jUnit: {
        report: true,
        savePath :'./reports/',
        useDotNotation: true,
        consolidate: true
      }
    }
  });

  grunt.registerTask('test', ['jasmine_node']);
  grunt.registerTask('default', ['test']);
};
