
const axios = require('axios').default;

function create_slack_response(slack_url, message) {
    console.log('sending slack response ' + message);
    axios.post(process.env.SLACK_ENDPOINT,
        {
            text: message
        }).then(function (response) {
            console.log('create_slack_response - response from api call to slack ' + response);
        }).catch(function (error) {
            console.log('create_slack_response - error from api call to slack ' + error);
        });
}

module.exports = {
    create_slack_response: create_slack_response
}
