
var add = require('date-fns/add');
var format = require('date-fns/format');
var parse = require('date-fns/parse');

function getTodaysDate() {
    console.log(`getTodaysDate in`);
    let d = new Date();
    str = format(d,'yyyyMMdd');
    console.log(str);
    console.log(`getTodaysDate out : ${str}`);
    return str;
}

function getCurrentDateWithTime() {
    console.log(`getCurrentDateWithTime in`);
    let d = new Date();
    str = format(d,'dd-MM-yyyy HH:mm:ss');
    console.log(str);
    console.log(`getCurrentDateWithTime out : ${str}`);
    return str;
}


function addDuration(durationType , duration ,contextDate ) {
    console.log(`addDuration  : durationType : ${durationType} , duration : ${duration} , contextDate : ${contextDate} ` )
    // context date is not given , assume todays date.
    let d = contextDate ? parse(contextDate,'yyyyMMdd',new Date()) : new Date();
    durationObj = {};
    switch(durationType) {
        case 'Months':
        case 'Month' :
            durationObj.months = duration;
            break;
        case 'Days' :
        case 'Day' :
            durationObj.days = duration;
            break;
        default : 
            durationObj.months = duration;
    }
    let out = add(d,durationObj);
    let out_str = format(out,'yyyyMMdd');
    console.log(`output date in yyymmdd format : ${out_str}`); 
    return out_str;
}


module.exports = {
    getTodaysDate : getTodaysDate,
    getCurrentDateWithTime : getCurrentDateWithTime,
    addDuration :  addDuration
}