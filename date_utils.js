
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
        case 'Monthly' :
        case 'monthly' :
        case 'month' :
        case 'months' :  
            durationObj.months = duration;
            break;
        case 'Days' :
        case 'Day' :
        case 'day' :
        case 'days' :
        case 'daily' :
        case 'Daily' :
            durationObj.days = duration;
            break;
        case 'Years' : 
        case 'Yearly' :
        case 'Year' :
        case 'year' :
        case 'years' :
        case 'yearly' :
            durationObj.years = duration;
            break;
        default : 
            durationObj.months = duration;
    }
    let out = add(d,durationObj);
    let out_str = format(out,'yyyyMMdd');
    console.log(`output date in yyymmdd format : ${out_str}`); 
    return out_str;
}

function displayDate(dateStr) {
    let d = dateStr ? parse(dateStr,'yyyyMMdd',new Date()) : new Date();
    let displayStr = format(d,'dd-MM-yyyy HH:mm:ss');
    return displayStr;
}

function getDateFromCommand(dateStr){
    let d = contextDate ? parse(contextDate,'yyyy-MM-dd',new Date()) : new Date();
    let standardFormat = format(d,'yyyyMMdd');
    console.log(`getDateFromCommand ${standardFormat}`);
    return standardFormat;
}


module.exports = {
    getTodaysDate : getTodaysDate,
    getCurrentDateWithTime : getCurrentDateWithTime,
    addDuration :  addDuration,
    displayDate : displayDate,
    getDateFromCommand : getDateFromCommand
}