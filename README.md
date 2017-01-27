# rnsync_key_generator

## About

rnsync_key_generator will communicate with Cloudant to create new database and retrieve credentials for that database.  This package was made to be used with [RNSync](https://github.com/pwcremin/RNSync), but can of course be used however you wish.

## Udates

 
## Installation

Install with npm
```ruby
npm install --save rnsync_key_generator
```

## Usage

```ruby
let express = require('express');
let rnsync_key_generator = require('rnsync_key_generator');

rnsync_key_generator.init("https://user:pass@xxx-bluemix.cloudant.com");

let app = express();
app.use('/genkey', rnsync_key_generator.router);
```

response looks like:
```json
 {
 "password": "YPNCaIX1sJRX5upaL3eqvTfi",
 "ok": true,
 "key": "blentfortedsionstrindigl"
 }
 ```
