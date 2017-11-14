var fs = require('fs');
var request = require('request');
var path = require('path');
var util = require("util");
var EventEmitter = require("events").EventEmitter;


var UPLOAD_URL = "https://upload.diawi.com/";
var STATUS_URL = "https://upload.diawi.com/status";
var POLL_MAX_COUNT = 10;
var POLL_INTERVAL = 2;


const sleep = (seconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, (seconds * 1000));
    });
};


var Diawi = function(opts) {
  if (!opts) {
      opts = {};
  }

  this.token = opts.token.trim();
  this.path = opts.path.trim();

  //console.log("Starting upload of '" + this.path + "' with token '" + this.token.substring(0, 3) + "...'");

  // Create the required form fields
  var formData = {
    token: this.token,
    file: fs.createReadStream(this.path)
  };

  // Append the optional parameters to the formData
  [ "password" ].forEach((key) => {
    if (opts[key]) {
      formData[key] = opts[key];
    }
  });

  //console.log(formData);

  request.post({ url: UPLOAD_URL, formData: formData }, this.onUploadComplete.bind(this));
}

Diawi.prototype.onUploadComplete = function(err, response, body) {
  if (err) {
    this.emit("error", new Error(err));
    return;
  }

  try {
    var json = JSON.parse(body);
    this.job = json.job;
    //console.log("Job found: ", this.job);

    this.poll.bind(this)();

  } catch (err) {
    this.emit("error", new Error(err));
  }
}

Diawi.prototype.poll = function(pollCount) {
  if (pollCount > POLL_MAX_COUNT) {
    this.emit("error", new Error("Timed out polling for job completion"));
    return;
  }

  sleep(POLL_INTERVAL).then(function() {

    var url = STATUS_URL + "?job=" + this.job + "&token=" + this.token;
    request.get(url, function(err, response, body) {
      if (err) {
        this.emit("error", new Error(err));
        return;
      }

      try {
        var json = JSON.parse(body);

        switch (json.status) {
          case 2000:
            if (json.link) {
              this.emit("complete", json.link);
            } else {
              this.emit("error", new Error("Failed to get link from success response"));
            }

            return;

          case 2001:
            // Nothing, this just means poll again
            break;

          default:
            this.emit("error", new Error("Error in status response - " + json.message));
            return;
        }

      } catch (err) {
        this.emit("error", new Error(err));
        return;
      }

      this.poll(pollCount+1);
    }.bind(this));
  }.bind(this));
}

util.inherits(Diawi, EventEmitter);
module.exports = Diawi;
