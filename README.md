Diawi node module
==

Usage:
--

Script:
```
var Diawi = require("diawi");

new Diawi({ token: "api token", path: "path/to/app.ipa" })
  .on("complete", function(url) { ... })
  .on("error", function(error) { ... })
```

Command line:


The simplest way is just to pass your token and the path to the ipa/apk/zip
```
> diawi <token> <path/to/app.ipa>
path/to/uploaded.ipa
```
(which is shorthand for `diawi upload <token> <path>`)

You can get some help like:
```
> diawi --help
```

The output of that should tell you how to pass optional arguments (i.e. `-p passw0rd` will password protect the uploaded app). The end goal (still a way off)
is to support the full list of optional parameters. See `--help` to see what's currently supported.

Description
--

This module is designed to be used in a CI (bitrise in my case) so it's only output
for success is the path to the uploaded ipa in Diawi.

You will need an api token to use this module - it's free to sign up and get,
just go here: https://dashboard.diawi.com/signup. You create an api token in the
profile tab.


Bitrise
---

To integrate with bitrise there is a bitrise-upload step in the bitrise StepLib.

I then follow it with a Slack notification step using the `DIAWI_IPA_URL` from earlier.
```
- slack@2.6.3:
    inputs:
    - channel: "#release_channel"
    - message: "New App Release - \nDiawi Page: ${DIAWI_IPA_URL}"
    - emoji: ":thumbsup_all:"
    - webhook_url: https://hooks.slack.com/services/AAAAAAA/BBBBBBB
    - from_username: iOS App Deployment
    title: 'Share link on #release_channel'
    is_always_run: false
```
