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
is to support the full list of optinal parameters. See `--help` to see what's currently supported.

Description
--

This module is designed to be used in a CI (bitrise in my case) so it's only output
for success is the path to the uploaded ipa in Diawi.

You will need an api token to use this module - it's free to sign up and get,
just go here: https://dashboard.diawi.com/signup. You create an api token in the
profile tab.


Bitrise
---

To integrate this into Bitrise needs two steps, one to install the npm module,
and another to upload the ipa.

The first step is just the default npm step, specifying to install globally the
diawi module.

The second step is a script which takes in two parameters
  - `DIAWI_TOKEN` is an env variable configured for this workflow.
  - `BITRISE_IPA_PATH` is the env variable created from a previous archive step

The script pipes the output of diawi (which is a url) into the env variable
`DIAWI_IPA_URL`, which we then use in a Slack message.

```
- npm@0.9.0:
    inputs:
    - command: install diawi -g
    title: Install diawi npm module
- script@1.1.5:
    title: Upload to Diawi
    inputs:
    - content: |-
        #!/usr/bin/env bash
        # fail if any commands fails
        set -e
        # debug log
        set -x

        diawi ${DIAWI_TOKEN} ${BITRISE_IPA_PATH} | envman add --key DIAWI_IPA_URL
```

FYI: Here's the Slack notification step using the `DIAWI_IPA_URL` from earlier.
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
