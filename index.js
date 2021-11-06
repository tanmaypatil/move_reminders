const move_alarms = require("./move_alarms");

exports.handler =  async function(event, context) {
    console.log(` start execution of lambda ${context.functionName}`);
    console.log("EVENT: \n" + JSON.stringify(event, null, 2));
    console.log(`move alarm - alarm date ${event.alarmDate} , alarm id - ${event.alarmId} `);
    if ( !event.alarmDate || !event.alarmId) {
      console.log('mandatory argument not provided');
      return Error('Either alarmDate or alarmId should be provided');
    }
    move_alarms(event.alarmDate,event.alarmId);

    return context.logStreamName
  }