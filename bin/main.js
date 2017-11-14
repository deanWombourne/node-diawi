#!/usr/bin/env node

var Diawi = require("../diawi.js");


function printUsage() {
  console.log("Usage: node", path.basename(process.argv[1]), "<api token>", "<path/to/app.ipa>");
}


if (process.argv.length < 4) {
  printUsage();
} else {
  var token = process.argv[2]
  var ipaPath = process.argv[3]

  var diawi = new Diawi({ token: token, path: ipaPath })
    .on("complete", function(url) {
      console.log(url);
    })
    .on("error", function(error) {
      console.log("Failed: ", error);
      process.exit(1);
    });
}
