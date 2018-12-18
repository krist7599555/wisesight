'use strict';
module.exports = {
    getErrorType: function (err) { // err is a string
        let idx1 = err.indexOf('index: ') + 7;
        let idx2 = err.indexOf(' dup key:')-2;
        return err.slice(idx1, idx2);
    }
}