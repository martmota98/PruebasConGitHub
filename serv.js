// This application uses express as its web server
var express = require('express');
// Parse the application/json requests we get from the client
var bodyParser = require('body-parser');
// LDAP library, documented at http://ldapjs.org/client.html
var ldap = require('ldapjs');
// cfenv provides access to your Cloud Foundry environment
var cfenv = require('cfenv');
var assert = require('assert');

var session = require('express-session');


// create a new express server
var app = express();


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
// parse application/json
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.get('/', (req, res) => {
	res.render('index', {auth: 'Credenciales Incorrectas'});
  });
app.get('/logged', (req, res) => {
    res.render('logged');
});  

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


  
 
app.post("/ldap", (req, originalres) => {
	var client = ldap.createClient({
		url: req.body.serverUrl
  });
	var group = '(cn=profesores)';
	var error = '';
	
	//Con el usuario joindomain se obtiene el gidNumber de profesores //TODO: Comprobar todo tipo de errores
client.bind(req.body.readerDN,req.body.readerPwd, function(err) {
    var opts = {
        scope: 'sub',
        filter: group,  //TODO: Profesores ha de ser una variable global fácilmente modificable
        attributes: ['gidNumber']
    };

    client.search(req.body.suffix, opts, function (err, res) {
        assert.ifError(err);

        res.on('searchEntry', function (entry) {
            //console.log('entry: ' + JSON.stringify(entry.object));

            //Obtención del gidNumber
            var gidNumber = entry.object.gidNumber;

            //Se ha de comprobar si el usuario es capaz de validar
            client.bind('uid=' + req.body.username +',ou=usuarios,dc=centro,dc=com', req.body.password, function (err) {  //TODO: Modificar maguilellas y password por los datos del formulario
                var opts1 = {
                    scope: 'sub',
                    filter: `(&(uid=${req.body.username})(gidNumber=${gidNumber}))`  //TODO: Modificar maguilellas por el usuario pasado en el formulario
                };


                client.search(req.body.suffix, opts1, function (err, res1) {

                    res1.on('searchEntry', function (entry) {
                        console.log('entry: ' + JSON.stringify(entry.object));

                        if(entry){
						    console.log("El usuario ha logeado correctamente");
                            originalres.redirect('/logged');
                        }
                    });

                  
                    
                    res1.on('error', function (err) {
						console.error('error: ' + err.message);
					  
                    });
                 });
            });      
        });
        res.on('searchReference', function (referral) {
            console.log('referral: ' + referral.uris.join());
        });
        res.on('error', function (err) {
            console.error('error: ' + err.message);
        });
        res.on('end', function (result) {
            console.log('status: ' + result.status);
		});
		
    });
});

	});
	
		

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '127.0.0.1', function() {
  // print a message when the server starts listening
  console.log("Server 🏃 at: " + appEnv.url);
});
