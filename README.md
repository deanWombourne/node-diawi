Diawi node module

Usage:


Script:
```
var Diawi = require("diawi");

new Diawi({ token: "api token", path: "path/to/app.ipa" })
  .on("success", function(url) { ... })
  .on("error", function(error) { ... })
```

Command line:

```
diawi <token> <path/to/app.ipa>
```
