var pg = require('pg');
pg.defaults.ssl = true;
var connectionString = process.env.DATABASE_URL || 'postgres://jvklycyheinwek:363oQzt7lRSekKHbhB6ylRsi88@ec2-23-21-157-223.compute-1.amazonaws.com:5432/de9vchknc2c7ha';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });
