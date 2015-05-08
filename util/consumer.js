var kueConfig = require('./../config/workerQueue');
var sendgrid  = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASS);

var fs = require('fs');
var gm = require('gm');

var kue = require('kue');
var redis = require('redis');
var jobs = kue.createQueue(kueConfig.kue);


// consume the email queue
exports.processEmail = function() {

  jobs.process('email', 2, function(job, done) {

    var email = new sendgrid.Email();

    email.addTo(job.data.to);
    email.setFrom(job.data.from);
    email.setSubject(job.data.subject);
    email.setHtml(job.data.text);

    sendgrid.send(email, function(err, json) {
      if (err) { return console.error(err); }
      console.log(json);
    });

    done();
  });
};


// consume the image queue
exports.processImage = function() {

  jobs.process('image', 2, function(job, done) {

    var url = '../tmp/images/' + job.data.name;

    gm(job.data.name)
      .compress('BZip')
      .resize(640)
      .strip()
      .write(url, function (err) {
        if (!err) { console.log('done'); }
        else { console.log(err); }
      });

    done();
  });
};
