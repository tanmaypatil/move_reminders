const querystring = require('querystring');

function getUidOfAlarm(str) {
    let payload = querystring.unescape(str);
    let bare_payload = payload.substr(8);
    let obj = JSON.parse(bare_payload);
    console.log('getUidOfAlarm - after parse '+JSON.stringify(obj));
    let actions = obj.actions;
    console.log('getUidOfAlarm - actions from payload '+JSON.stringify(actions));
    // Assuming only 1 button clicked 
    let uid = actions[0].value;
    // split the string to get uid and action
    let arr = uid.split('|');
    uid = arr[0];
    console.log('getUidOfAlarm - uid of the button '+uid);
    let user_action = arr[1];
    console.log('getUidOfAlarm -user action is '+user_action);
    //get the response url 
    let response_url = querystring.unescape(obj.response_url);
    console.log('getUidOfAlarm - response url is '+response_url);
    return { uid : uid , user_action : user_action , response_url : response_url };
}

module.exports = {
    getUidOfAlarm : getUidOfAlarm
}