var express = require('express'),
	app = express(),
	methodOverride = require("method-override"),
	bodyParser = require("body-parser"),
    request = require('request'),
    jwt = require('jsonwebtoken'),
    path = require('path'),
    Linkedin = require('node-linkedin')('81sypia8a8ew12', '2qStDOPl7rIzCqoN', 'https://shielded-plateau-22660.herokuapp.com/profile/signin-linkedin'),
    scope = ['r_basicprofile', 'r_emailaddress'];

var fN, lN, id, info;
var info1 = [];
const PORT = 5000;
app.set("port", process.env.PORT || 3001);
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

app.get('/home',function(req,res){
	res.send('home');
})

app.get('/oauth/linkedin', function(req, res) {
    // This will ask for permisssions etc and redirect to callback url.
    Linkedin.auth.authorize(res, scope);
});

app.get('/profile/signin-linkedin',function(req,res){
	 Linkedin.auth.getAccessToken(res, req.query.code, req.query.state, function(err, results) {
        if ( err )
            return console.error(err);
        console.log(results);
        request({url:'https://api.linkedin.com/v1/people/~:(id,summary,positions:(id,summary),location,skills,email-address,first-name,last-name,headline,num-connections,picture-url,siteStandardProfileRequest,api-standard-profile-request)?format=json&oauth2_access_token='+results.access_token},function(error,response, body){
	        if (!error && response.statusCode == 200) {
				console.log('hurray');
				//console.log(response);
				console.log('body is :'+body);
				info = JSON.parse(body);
				info1[0] = info;
				console.log(info1);
				console.log(info.firstName);
				fN = info.firstName;
				lN = info.lastName;
				id = info.id;
				res.redirect('/api/userinfo');
			}
			else{
				console.log(body);
			}
        })
    });
});

app.get('/api/userinfo',function(req,res){
	console.log('hii');
	res.render('profile',{user:info});
	//res.send(info1);
	
});


app.listen(app.get("port"));