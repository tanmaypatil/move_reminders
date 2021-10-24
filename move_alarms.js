var AWS = require("aws-sdk");
let date_util = require('./date_util');
let util = require("./utils");
let endpoint = util.get_endpoint();

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: endpoint
});

var docClient = new AWS.DynamoDB.DocumentClient();


async function move_alarm(alarm_id , alarm_date) {
    // select old alarm using alarm_id 
    console.log(` inside move_alarm - ${alarm_id} and ${alarm_date}`);
    var params = {
        TableName: "user_alarms",
        IndexName: "entity_id-index",
        KeyConditionExpression: "#alarm_id = :alarm_id  ",
        ExpressionAttributeNames: {
            "#alarm_id": "alarm_id"
        },
        ExpressionAttributeValues: {
            ":alarm_id": alarm_id
        }
    };
  
    let alarm = await queryAlarm(params);
    // insert new alarm - post moving to new alarm
    await insertAlarm(alarm[0]);
    // delete old alarm
    await deleteAlarm(alarm[0]);
}

// query alarm using index - alarm_id
async function queryAlarm(params) {
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.error("query_alarm : Unable to query. Error:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("query_alarm : Query succeeded.");
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

async function deleteAlarm(alarm ) {
    var delParams = {
        TableName: "user_alarms",
        Key:{
            "#alarm_type": "reminder",
            "#alarm_date": ":alarm_date"
        },
        ConditionExpression: "#alarm_date = :alarm_date  ",
        ExpressionAttributeNames: {
            "#alarm_date": "alarm_date"
        },
        ExpressionAttributeValues: {
            ":alarm_date": alarm.alarm_date
        }
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




function insertAlarm(alarm) {
    return new Promise(function (resolve, reject) {
        let old_date = alarm.alarm_date;
        let duration_type = alarm.frequency;
        let new_alarmdate = date_util.addDuration(duration_type, 1, old_date);
        console.log('insertAlarm : old_date is : ' + old_date);
        console.log('insertAlarm : new_alarmdate is : ' + new_alarmdate);
        // generate new alarm id 
        let id = alarm.entity_id.substr(1);
        let new_id =  parseInt(id) + 1 ;
        let entity_id = 'a' + new_id.toString();
        console.log('insertAlarm new alarm id '+entity_id);
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
                "type": "generated"

            }
        };
        console.log("insertAlarm : adding into user_alarms");
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("Added item: user_alarms", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
}

move_alarm('a3',)

module.exports = {
    insertAlarm : insertAlarm

}

