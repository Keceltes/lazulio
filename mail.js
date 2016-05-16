var express = require('express');
var wagner = require('wagner-core');

//registers models with wagner
var models = require('./models/models.js')(wagner);

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://kevin.j.tsai%40gmail.com:pass@smtp.gmail.com');

var date = new Date();
date.setDate(date.getDate() - 1);
var text = "";

models.User.find({}, function (error, docs) {
    if (error) {
        console.log(error);
        process.exit(1);
    }
    for (i = 0; i < docs.length; i++) { //for each user send an e-mail
        if (docs[i].email != undefined) {
            //figure out new assets created today that they have tags for
            models.Asset.
                find({
                tags: { $in: docs[i].interestedTags },
                _id: { $gt: Math.floor(date / 1000).toString(16) + "0000000000000000" } //todays date
            }).
                sort({ _id: -1 }).
                exec(function (err, assets) {
                //console.log(assets);
                text = text + '<h1>New tech in tags you follow</h1>';
                text = text + JSON.stringify(assets) + '<br/>';
                
                //figure out assets updated today
                var assetIds = [];
                for (var i = 0; i < docs[i].interestedAssets.length; i++) {
                    assetIds.push(docs[i].interestedAssets[i].asset);
                }
                models.Asset.
                    find({
                    _id: { $in: assetIds },
                    updatedAt: { $gt: date}
                }).
                    sort({ updatedAt: -1 }).
                    exec(function (err, assets) {
                    //console.log(assets);
                    text = text + '<h1>Updated assets for assets you follow</h1>';
                    text = text + JSON.stringify(assets) + '<br/>';

                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: '"Lazulio" <foo@blurdybloop.com>', // sender address, though can't fool the e-mail address
                        to: 'kevin.j.tsai@gmail.com', // list of receivers
                        subject: 'Daily digest from Lazulio', // Subject line
                        text: 'textHello world 🐴', // plaintext body, i guess this is when html doesn't work
                        html: text // html body
                    };
                    
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: ' + info.response);
                    });
                });
            });
        }
    }
});