const move_alarms = require("./move_alarms");
const uid_alarm = require('./alarm_uid');
const slack_resp = require('./slack_response');
const alarm_util = require('./alarm_wrapper');


exports.handler = async function (event, context) {
  let description = 'default description';
  console.log(` start execution of lambda ${context.functionName}`);
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  console.log(`move alarm - alarm date ${event.alarmDate} , alarm id - ${event.alarmId} `);

  console.log('index.js - check for command, move or create alarm');
  description = alarm_util.interpret_command(event.body);

  /*
  alarmObj = uid_alarm.getUidOfAlarm(event.body);
  alarmObj.alarmId = alarmObj.uid;
  if ( !alarmObj.alarmId) {
    console.log('mandatory argument not provided : alarmId not present');
    return Error('alarmId should be provided');
  }
  
}
else {
  alarmObj.alarmId = event.alarmId;
  alarmObj.alarmDate = event.alarmDate;
}

console.log("before calling moveAlarm " + JSON.stringify(alarmObj));
let data = await move_alarms.moveAlarm(alarmObj.alarmDate, alarmObj.alarmId,alarmObj.user_action);
console.log("before return lambda function " + data);
let alarm_desc = null;
alarm_desc = data.description;
console.log('sending a response to slack - message ');
let resp = await slack_resp.create_slack_response(alarmObj.response_url , alarm_desc);
*/
  //console.log('post sending a response to slack - message '+JSON.stringify(resp));
  let responseBody = { description: description };
  let response = {
    statusCode: 200,
    headers: {
    },
    body: JSON.stringify(responseBody)
  };
  return response;

}