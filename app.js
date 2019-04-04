var assert = require('assert');

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

var ldap = require('ldapjs');

//ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;

var client = ldap.createClient({
  url: 'ldap://192.168.3.8:389'
});

client.bind('uid=joindomain,ou=usuarios,dc=centro,dc=com', 'joindomain', function(err) {
  assert.ifError(err);
  //console.log(client);
  //client.search();

  var opts = {	
  scope: 'sub',
  filter: '(&(objectClass=*)(gidNumber=501))',
  attrs: 'memberOf'
};

client.search('dc=centro,dc=com', opts, function(err, res) {
  assert.ifError(err);

  res.on('searchEntry', function(entry) {
    console.log('entry: ' + JSON.stringify(entry.object));
  });
  res.on('searchReference', function(referral) {
    console.log('referral: ' + referral.uris.join());
  });
  res.on('error', function(err) {
    console.error('error: ' + err.message);
  });
  res.on('end', function(result) {
    console.log('status: ' + result.status);
  });
});

});

/*var opts = {
  filter: '(objectclass=user)',
  scope: 'sub',
  attributes: ['objectGUID']
};



client.bind('joindomain', 'joindomain', function (err) {
  console.log(client);
  /*client.search('OU=alumnos', opts, function (err, search) {
    search.on('searchEntry', function (entry) {
      var user = entry.object;
      console.log(user);
    });
  });*/
//});

//console.log(client);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});


