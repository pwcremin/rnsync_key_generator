let request = require( "request" );

//let cloudantUrl = 'https://user:pass@xxxx.cloudant.com';
//let dotenv = require( 'dotenv' ).config();
//let cloudantUrl = process.env.CLOUDANT;


class CloudantKeyGenerator {

    //cloudantUrl = 'https://user:pass@xxxx.cloudant.com';
    init( cloudantUrl )
    {
        this.cloudantUrl = cloudantUrl;
    }

    createDatabase( data )
    {
        return new Promise( ( resolve, reject ) =>
        {
            let url = cloudantUrl + '/' + data.dbname;

            request( { url: url, method: 'PUT' }, function ( response )
            {
                let DB_CREATION_SUCCESS = 201;
                let DATABASE_EXISTS = 412;

                if ( response.statusCode != DB_CREATION_SUCCESS && response.statusCode != DATABASE_EXISTS )
                {
                    reject( 'db creation failed: ' + response.statusCode );
                }

                resolve( data );
            } );
        } )

    }

    generateApiKey( data )
    {
        return new Promise( ( resolve, reject ) =>
        {
            let url = cloudantUrl + '/_api/v2/api_keys';

            /* response looks like
             {
             "password": "YPNCaIX1sJRX5upaL3eqvTfi",
             "ok": true,
             "key": "blentfortedsionstrindigl"
             }
             */

            request( { url: url, method: 'POST' }, function ( response )
            {
                if ( response.statusCode !== 201 )
                {
                    reject( 'api generation failed: ' + response.statusCode );
                }

                let apiKey = JSON.parse( response.body );

                data.key = apiKey.key;
                data.password = apiKey.password;

                resolve( data );
            } )
        } )

    }

    assignKeyToDatabase( data )
    {
        return new Promise( ( resolve, reject ) =>
        {
            // Docs: https://docs.cloudant.com/authorization.html

            let url = cloudantUrl + '/_api/v2/db/' + data.dbname + '/_security';

            let body = { cloudant: {} };
            body.cloudant[ data.key ] = [
                "_reader",
                "_writer"
            ];

            body.cloudant[ 'nobody' ] = [];

            return request( {
                url: url,
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( body )
            }, function ( response )
                {
                    if ( response.statusCode !== 200 )
                    {
                        reject( 'database security update failed: ' + response.statusCode );
                    }

                    resolve( data );
                } );
        });
    }

    genkey( req, res )
    {
        let dbname = req.query.dbname;

        if ( !dbname )
        {
            res.status( 500 ).send();
            return;
        }

        let data = { dbname: dbname };

        this.createDatabase( data )
            .then( this.generateApiKey.bind( this ) )
            .then( this.assignKeyToDatabase.bind( this ) )
            .then( function ( data )
            {
                res.json( data );
            } )
            .catch( function ( err )
            {
                res.status( 500 ).send( err );
            } )
    };
}


module.exports = new CloudantKeyGenerator();