const move_alarms = require("./move_alarms");

exports.handler = async function (event, context) {
  let alarmObj = {};
  console.log(` start execution of lambda ${context.functionName}`);
  console.log("EVENT: \n" + JSON.stringify(event, null, 2));
  console.log(`move alarm - alarm date ${event.alarmDate} , alarm id - ${event.alarmId} `);
  if (!event.alarmDate || !event.alarmId) {
    console.log('not present in event object directly');
    alarmObj = JSON.parse(event.body);
    console.log('move alarm - body after parsing ' + JSON.stringify(alarmObj));
    if (!alarmObj.alarmDate || !alarmObj.alarmId) {
      console.log('mandatory argument not provided');
      return Error('Both alarmDate or alarmId should be provided');
    }
  }
  else {
    alarmObj.alarmId = event.alarmId;
    alarmObj.alarmDate = event.alarmDate;
  }
  console.log("before calling moveAlarm " + JSON.stringify(alarmObj));
  let data = await move_alarms.moveAlarm(alarmObj.alarmDate, alarmObj.alarmId);
  console.log("before return lambda function " + JSON.stringify(data));

  let responseBody = { description: "alarm moved successfully" }

  let response = {
    statusCode: 200,
    headers: {
    },
    body: JSON.stringify(responseBody)
  };
  return response;


}