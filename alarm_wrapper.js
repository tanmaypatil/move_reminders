
const querystring = require('querystring');
const fetch_alarm = require('./alarm_uid');
const date_utils = require('./date_utils');
const alarm_util = require('./move_alarms');
const slack_resp = require('./slack_response');


async function  interpret_command(str) {
    let response_url= null;
    let return_data = {};
    let payload = querystring.unescape(str);
    console.log('interpret_command ,payload '+payload);
    let index = payload.search("command.*text");
    if (index != -1) {
        // it means that slack command to create alarm
        console.log('interpret_command , a command to create the new alarm');
        return_data = await create_alarm_command(payload);
        response_url = return_data.response_url;
    }
    else {
        let alarmObj = fetch_alarm.getUidOfAlarm(payload);
        return_data = await alarm_util.moveAlarm(alarmObj.alarmDate, alarmObj.alarmId, alarmObj.user_action);
        response_url  = alarmObj.response_url;
        console.log("interpret_command - After moveAlarm function " + return_data.description);
    }
    console.log('interpret_command : response_url'+response_url);
    let resp = await slack_resp.create_slack_response(response_url, return_data.description);
    console.log('interpret_command -post sending a response to slack - message ' + JSON.stringify(resp));
    return return_data.description;
}

function extract_frequency(repeat) {
    let regexp = /(?<repeat>(?<=repeat\s+)(monthly|daily|yearly))/mg;
    let match = regexp.exec(repeat);
    let frequency = match.groups.repeat;
    console.log('extract_frequency :' + frequency);
    return frequency;
}

function extract_commandinfo(str) {
    let searchParams = new URLSearchParams(str);
    let command = searchParams.get('command');
    console.log("extract_commandinfo " + command);
    let text = searchParams.get('text');
    console.log("extract_commandinfo : "+text);
    let response_url = searchParams.get('response_url');
    console.log('extract_commandinfo : '+response_url);
    return { text : text , command : command , response_url : response_url };
}

async function create_alarm_command(command) {
    //extract command 
    console.log('create_alarm_command : before extract_commandinfo ');
    let commandObj = extract_commandinfo(command);
    let regexp =/create alarm due on (?<dueDate>[0-9-]*)\s+(?<desc>for.*(?=repeat))(?<repeat>repeat\s*(monthly|yearly|daily))*/mg
    //command is wrapped in string ,use regex to get values
    let match = regexp.exec(commandObj.text);
    let dueDate = '';
    let repeat = 'Monthly';
    let desc = 'unspecified';
    do {
        console.log(`create_alarm_command - dueDate ${match.groups.dueDate} - repeat ${match.groups.repeat}`);
        console.log(`create_alarm_command - desc ${match.groups.desc}`);
        dueDate = match.groups.dueDate;
        repeat = match.groups.repeat;
        desc = match.groups.desc;
    } while ((match = regexp.exec(commandObj.text)) !== null);
    // prepare for alarm creation 
    let current_datetime = date_utils.getTodaysDate();
    // extract alarm frequency 
    let frequency = extract_frequency(repeat);
    frequency = frequency === null ? 'Monthly' : frequency;
    console.log('create_alarm_command frequency' + frequency);
    // get the date formatted as required by dynamodb - yyyymmd
    let new_alarmdate = date_utils.getDateFromCommand(dueDate);
    console.log('create_alarm_command alarm date' + new_alarmdate);
    let day = new_alarmdate.substr(6,2);
    console.log('create_alarm_command , day '+day);
    // insert alarm 
    let alarm =
    {
        "alarm_type": "reminder",
        "alarm_date": new_alarmdate,
        "user_id": 'u1',
        "description": desc,
        "frequency": frequency,
        "day": day,
        "type": "generated",
        "time_stamp": current_datetime
    }
    console.log('create_alarm_command : '+JSON.stringify(alarm));
    let data = await alarm_util.insertAlarm(alarm, 'create');
    console.log('create_alarm_command : '+data);
    let descriptionObj =  alarm_util.setDescription('create', data);
    descriptionObj.response_url = commandObj.response_url;
    return descriptionObj;
}

module.exports = {
    interpret_command : interpret_command
}