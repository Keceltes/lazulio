var express = require('express');
var wagner = require('wagner-core');

//registers models with wagner
var models = require('./models/models.js')(wagner);

var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://contact%40lazulio.com:Lazulio0@smtp.zoho.com');

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
                for (j = 0; j < assets.length; j++) {
                    var asset = assets[j];
                    text = text + '<h2>name: ' + asset.name + '</h2>';
                    text = text + 'current number of followers: ??<br/>';
                    text = text + 'view count: '+ asset.viewCount +'<br/>';
                    text = text + 'description: '+ asset.description +'<br/>';
                    text = text + 'organization: '+ asset.organization +'<br/>';
                    text = text + 'market: '+ asset.market +'<br/>';
                    text = text + 'IP status: '+ asset.ipStatus +'<br/>';
                    text = text + 'problem: '+ asset.problem +'<br/>';
                    text = text + 'solution: '+ asset.solution +'<br/>';
                    text = text + 'application: '+asset.application+'<br/>';
                    text = text + 'advantages: '+asset.advantages+'<br/>';
                    text = text + 'looking for: '+asset.lookingFor+'<br/>';
                    text = text + 'contact: '+asset.contact+'<br/>';
                    text = text + 'tags: '+asset.tags+'<br/>';
                }

                
                //figure out assets updated today
                var assetIds = [];
                for (var k = 0; k < docs[k].interestedAssets.length; k++) {
                    assetIds.push(docs[k].interestedAssets[k].asset);
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
                    for (l = 0; l < assets.length; l++) {
                        var asset = assets[l];
                        text = text + '<h2>name: ' + asset.name + '</h2>';
                        text = text + 'current number of followers: ??<br/>';
                        text = text + 'view count: ' + asset.viewCount + '<br/>';
                        text = text + 'description: ' + asset.description + '<br/>';
                        text = text + 'organization: ' + asset.organization + '<br/>';
                        text = text + 'market: ' + asset.market + '<br/>';
                        text = text + 'IP status: ' + asset.ipStatus + '<br/>';
                        text = text + 'problem: ' + asset.problem + '<br/>';
                        text = text + 'solution: ' + asset.solution + '<br/>';
                        text = text + 'application: ' + asset.application + '<br/>';
                        text = text + 'advantages: ' + asset.advantages + '<br/>';
                        text = text + 'looking for: ' + asset.lookingFor + '<br/>';
                        text = text + 'contact: ' + asset.contact + '<br/>';
                        text = text + 'tags: ' + asset.tags + '<br/>';
                    }

                    // setup e-mail data with unicode symbols
                    var mailOptions = {
                        from: '"Lazulio" <contact@lazulio.com>', // sender address, though can't fool the e-mail address
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