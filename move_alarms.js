var AWS = require("aws-sdk");
let date_util = require('./date_utils');
let util = require("./utils");
const { v4: uuidv4 } = require('uuid');
let endpoint = util.get_endpoint();

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: endpoint
});

var docClient = new AWS.DynamoDB.DocumentClient();


async function moveAlarm(alarm_date, alarm_id, user_action) {
    // select old alarm using alarm_id 
    console.log(` inside move_alarm - alarm_id ${alarm_id} and  alarm_date ${alarm_date} and user_action ${user_action}`);
    var params = {
        TableName: 'user_alarms',
        IndexName: 'entity_id-index',
        KeyConditionExpression: 'entity_id = :entity_id',
        ExpressionAttributeValues: {
            ':entity_id': alarm_id
        }
    };

    let alarm = await queryAlarm(params, alarm_id);
    if (alarm.length === 0) {
        return setDescription( user_action, alarm_id,"NO_ALARM");
    }
    // insert new alarm - post moving to new alarm
    let data = await insertAlarm(alarm[0], user_action);
    // delete old alarm
    await deleteAlarm(alarm[0]);
    return setDescription(user_action,data ,"ALARM_PRESENT");
}

// query alarm using index - alarm_id
async function queryAlarm(params, alarm_id) {
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("query_alarm : Unable to query. Error:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("query_alarm : Query succeeded." + JSON.stringify(data));
                if (data.Count === 0) {
                    console.log("alarm not found : " + alarm_id);
                    let arr = [];
                    resolve(arr);
                }
                //var arr = [];
                data.Items.forEach(function (item) {
                    console.log(" -", item.user_id + ": " + item.entity_id);
                    console.log(" next_date " + item.alarm_date);
                    console.log(" description " + item.description);
                    //arr.push(item);
                });
                resolve(data.Items);
            }
        });
    });
}

async function deleteAlarm(alarm) {
    console.log('inside deleteAlarm ' + alarm.alarm_date);
    var delParams = {
        TableName: "user_alarms",
        Key: {
            "alarm_type": "reminder",
            "alarm_date": alarm.alarm_date
        },

    };
    return new Promise((resolve, reject) => {
        docClient.delete(delParams, function (err, data) {
            if (err) {
                console.error("deleteAlarm : Unable to delete. Error:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("deleteAlarm : Delete succeeded.");
                resolve(data);
            }
        });
    });
}




function insertAlarm(alarm, user_action) {
    return new Promise(function (resolve, reject) {
        console.log("insertAlarm : IN - user_action "+user_action);
        let old_date = alarm.alarm_date;
        let duration_type = 'Days';
        switch (user_action) {
            case 'snooze':
                duration_type = 'Days';
                break;
            default:
                duration_type = alarm.frequency;
        }
        console.log('insertAlarm : user_action ' + user_action + ' duration type '+duration_type);
        let new_alarmdate = date_util.addDuration(duration_type, 1, old_date);
        let current_datetime = date_util.getCurrentDateWithTime();
        console.log('insertAlarm : old_date is : ' + old_date);
        console.log('insertAlarm : new_alarmdate is : ' + new_alarmdate);
        // generate new alarm id 
        let entity_id = uuidv4();
        console.log('insertAlarm new alarm id ' + entity_id);
        // want to insert a new alarm with new_alarmdate 
        var params = {
            TableName: "user_alarms",
            Item: {
                "alarm_type": "reminder",
                "alarm_date": new_alarmdate,
                "user_id": alarm.user_id,
                "entity_id": entity_id,
                "description": alarm.description,
                "frequency": alarm.frequency,
                "day": alarm.day,
                "type": "generated",
                "time_stamp": current_datetime,
                "extra_data" : alarm.extra_data
            }
        };
        console.log("insertAlarm : adding into user_alarms");
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("Added item: user_alarms", entity_id);
                let date_str = date_util.displayDate(new_alarmdate);
                resolve(date_str);
            }
        });
    });
}


function setDescription(user_action, data ,alarm_present) {
    let descriptionObj = { code : "DEFAULT" , description : "default"} ;
    console.log(`setDescription - user_action : ${user_action} , data : ${data} alarm_present : ${alarm_present}`);
    switch (alarm_present) {
        case "NO_ALARM":
            descriptionObj.code = 'NO_ALARM';
            descriptionObj.description = "alarm not found id :"+ data;
            break;
        default:
            switch (user_action) {
                case "snooze":
                    descriptionObj.code = 'snooze';
                    descriptionObj.description = "Alarm snoozed by 1 day to "+ data;
                    break;
                case "done":
                    descriptionObj.code = 'done';
                    descriptionObj.description = "Alarm moved successfully to  "+ data;
                    break;
            }
    }
    console.log('setDescription : '+ JSON.stringify(descriptionObj));
    return descriptionObj;

}

//moveAlarm('20211010','a1');

module.exports = {
    insertAlarm: insertAlarm,
    moveAlarm: moveAlarm

}

