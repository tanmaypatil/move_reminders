
const axios = require('axios').default;

function create_slack_response(slack_url, message)  {
    return new Promise(function(resolve,reject) {
    console.log('create_slack_response - sending slack app :' + message);
    console.log('create_slack_response - slack url :' + slack_url);
    axios.post(slack_url,
        {
            text: message
        }).then(function (response) {
            console.log('create_slack_response - response from api call to slack ' + response);
            resolve(response);
        }).catch(function (error) {
            console.log('create_slack_response - error from api call to slack ' + error);
            reject(error);
        });
    }); 
}

module.exports = {
    create_slack_response: create_slack_response
}
