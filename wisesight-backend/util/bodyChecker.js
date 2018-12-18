const assert = require('assert');

module.exports = {
    get: arr => function (req, res, next) {
        data = req.query;
        try {
            arr.forEach(key => {
                assert.ok(data[key]);
            });
            next();
        }
        catch (err) {
            return res.status(400).send(`Invalid request, expect non empty ${arr}`);
        }
                        
    },
    post: arr => function (req, res, next) {
        data = req.body;
        try {
            arr.forEach(key => {
                assert.ok(data[key]);
            });
            next();
        }
        catch (err) {
            return res.status(400).send(`Invalid request, expect non empty ${arr}`);
        }
                        
    }
} 