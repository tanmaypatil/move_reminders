const move_alarms = require("./move_alarms");
const uid_alarm = require('./alarm_uid');
const slack_resp = require('./slack_response');


exports.handler = async function (event, context) {
  let alarmObj = {};
  console.log(` start execution of lambda ${context.functionName}`);
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  console.log(`move alarm - alarm date ${event.alarmDate} , alarm id - ${event.alarmId} `);
  if (!event.alarmDate || !event.alarmId) {
    console.log('not present in event object directly');
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
  let data = await move_alarms.moveAlarm(alarmObj.alarmDate, alarmObj.alarmId);
  console.log("before return lambda function " + data);
  let alarm_desc = `alarm moved successfully , new alarm on  ${data}`;
  console.log('sending a response to slack - message ');
  let resp = await slack_resp.create_slack_response(alarmObj.response_url , alarm_desc);
  console.log('post sending a response to slack - message '+JSON.stringify(resp));
  let responseBody = { description: alarm_desc };
  let response = {
    statusCode: 200,
    headers: {
    },
    body: JSON.stringify(responseBody)
  };
  return response;

}