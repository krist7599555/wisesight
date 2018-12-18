const bodyParser = require('body-parser');
const app = require('express')();
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

// my modules
const userAPI = require('./api/user/auth');
const schemas = require('./schemas');
const CONFIG = require('./config');
// shortcuts

// const objects
const client = mongoose.createConnection(CONFIG.mongoIP);
const db = mongoose.connection;



const User = client.model('User', schemas.UserSchema);

User.once('index', _ => {
    console.log('I: MAIN: Indexing completed')
    app.use(cors());
    app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  	next();
});
    app.use(logger('common'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended : true
    }));
    
    app.listen(3000, () => {
        console.log(`server started at port 3000`);
    })
    
    app.get('/', (req, res) => {
        res.send("Hello World");
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    })
    
    app.use('/api/user', userAPI);
})
