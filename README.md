# rnsync_key_generator

## About

rnsync_key_generator handles the creation of database and generation of credentials as recommended in the [Cloudant Sync doc](https://github.com/cloudant/sync-android/blob/master/doc/replication.md). This package was made to be used with [RNSync](https://github.com/pwcremin/RNSync), but can of course be used however you wish.
 
## Installation

Install with npm
```ruby
npm install --save rnsync_key_generator
```

## Usage

The database name must start with a character and only lowercase characters (a-z), digits (0-9), and any of the characters _, $, (, ), +, -, and / are allowed. 

#### Router

```javascript
let express = require('express');
let rnsync_key_generator = require('rnsync_key_generator');

// You can retrieve your cloudant_url by accessing the Cloudant Service Credentials from your Bluemix.net dashboard
rnsync_key_generator.init("https://user:pass@xxx-bluemix.cloudant.com");

let app = express();
app.use('/genkey', rnsync_key_generator.router);
```
The router accepts a GET request and expects there to be a query parameter 'dbname'. 

```
http://server.com/genkey?dbname=mydbname
```

response looks like:
```json
 {
 "password": "YPNCaIX1sJRX5upaL3eqvTfi",
 "ok": true,
 "key": "blentfortedsionstrindigl"
 }
 ```
#### Genkey

Simply call rnsync_key_generator.genkey('dbname') to get the db credentials

```javascript
router.get( '/', function ( req, res, next )
{
    let userId = req.user.sub;

    rnsync_key_generator.genkey('u' + userId)
     .then( (dbCredentials) =>
     {
         res.status( 200 ).json( { dbCredentials } )
     })
     .catch( (error) => {
         res.status( 500 ).json( { error } )
     })
}
```
