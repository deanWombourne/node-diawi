Diawi node module
==

Usage:
--

Script:
```
var Diawi = require("diawi");

new Diawi({ token: "api token", path: "path/to/app.ipa" })
  .on("success", function(url) { ... })
  .on("error", function(error) { ... })
```

Command line:

```
> diawi <token> <path/to/app.ipa>
path/to/uploaded.ipa
```


Description
--

This module is designed to be used in a CI (bitrise in my case) so it's only output
for success is the path to the uploaded ipa in Diawi.

You will need an api token to use this module - it's free to sign up and get,
just go here: https://dashboard.diawi.com/signup. You create an api token in the
profile tab.
