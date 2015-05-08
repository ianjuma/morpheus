var kueConfig = require('../config/workerQueue');
var kue = require('kue');
var redis = require('redis');
var jobs = kue.createQueue(kueConfig.kue);


// send user email - any - email 'kind' agnostic
exports.sendEmail = function(user) {

  var job = jobs.create('email', {
    to: user.email,
    from: 'no-reply@autobay.co.ke',
    subject: user.subject,
    title: user.title,
    text: user.body,
    template: 'User-email'
  }).priority('high');

  job.attempts(2).backoff( true );
  job.save();
};


// push image to the image queue
exports.sendImage = function(image) {

  var job = jobs.create('image', {
    name: image.name,
    template: 'Image-manipulation'
  }).priority('high');

  job.attempts(1).backoff( true );
  job.save();
};
