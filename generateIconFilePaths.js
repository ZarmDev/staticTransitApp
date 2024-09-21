// To generate a bunch of require statements
const trainLinesWithIcons = ["1", "2", "3", "4", "5", "6", "6x", "7", "7x", "a", "b", "c", "d", "e", "f", "g", "h", "j", "l", "m", "n", "q", "r", "s", "sf", "sir", "sr", "t", "w", "z"]
function forRequire() {
  var requireStatements = '';
  for (var i = 0; i < trainLinesWithIcons.length; i++) {
    requireStatements += `require('../../assets/images/svg/${trainLinesWithIcons[i]}.svg'), \n`
  }
  var test = `[${requireStatements}]`
  console.log(test);
}

function forHTML() {
  var requireStatements = '';
  for (var i = 0; i < trainLinesWithIcons.length; i++) {
    requireStatements += `'./images/svg/${trainLinesWithIcons[i]}.svg', \n`
  }
  var test = `[${requireStatements}]`
  console.log(test);
}
forHTML()