var express = require ('express');
var nodemailer = require('nodemailer');
var hash = require('object-hash')
var app=express();

var verified = false;
var emailhash = '';

app.get('/:emailid', function(req, res){
    var email= req.params.emailid;
    var random = Math.floor(Math.random()*100);
    emailhash = hash([email, random]);
    var url= "http://localhost:8000/emailverification/" +emailhash;
    async function main() {
        let transporter = nodemailer.createTransport({
            service: "Gmail", 
            auth: {
            user: '', 
            pass: '', 
            },
        });
        let inf = await transporter.sendMail({
            from: '"Tech Club NMIMS" ',
            to: email, 
            subject: "Email verification", 
            text: 'Please click on the link to verify your account:' + url,
            html: "<p> Please click on the link to verify your account: <a href= "+url+"> "+url+" </a></p>", 
        }, 
        function(error, info){
            if(error)
            {
                res.send('error occured');
            }
            else{
                res.send('email sent successfully')
            }
            console.log("Message sent: %s", info.messageId);
    
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        });
        }
        main().catch(console.error);
});

app.get('/emailverification/:hash', function(req, res){
    if(req.params.hash == emailhash)
    {
        verified = true;
        res.send('your email has been verified');
    }
    else
    {
        res.send('error occured');
    }
    console.log(verified);
});

app.listen(8000, function(){
    console.log('server started');
});