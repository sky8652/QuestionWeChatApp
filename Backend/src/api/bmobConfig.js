var Bmob = require('../../static/Bmob-1.6.5.min.js')

export function bmob() {
    Bmob.initialize("","","");
    return Bmob
}