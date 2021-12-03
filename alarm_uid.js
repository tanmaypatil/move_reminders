const querystring = require('querystring');

function getUidOfAlarm(str) {
    let payload = querystring.unescape(str);
    let bare_payload = payload.substr(8);
    let obj = JSON.parse(bare_payload);
    let actions = obj.message.actions;
    console.log('actions from payload '+JSON.stringify(actions));
    // Assuming only 1 button clicked 
    let uid = actions[0].value;
    console.log('uid of the button '+uid);
    return uid;
}

module.exports = {
    getUidOfAlarm : getUidOfAlarm
}