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
  description = await alarm_util.interpret_command(event.body);
  console.log('index.js - post interpret_command'+description);

  let responseBody = { description: description };
  let response = {
    statusCode: 200,
    headers: {
    },
    body: JSON.stringify(responseBody)
  };
  return response;

}