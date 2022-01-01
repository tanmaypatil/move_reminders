var assert = require('assert');
const querystring = require('querystring');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('validate it is slack command ', function() {
    let str = "token=pqCXZIRS34rO16EyPC21pb11&team_id=T02EGJSRSCD&team_domain=bills-yyp4270&channel_id=C02EKKDHGDQ&channel_name=bill-notification&user_id=U02EY80NKAM&user_name=tany.patil77&command=%2Falarm&text=create+alarm+due+on&api_app_id=A02F90YP2JJ&is_enterprise_install=false&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT02EGJSRSCD%2F2886145261587%2F0v1WWSMAsz10qOS7aZemtqOn&trigger_id=2888404157860.2492638876421.75b9ee36440dafc39ffcf154566ed50d"
    let payload = querystring.unescape(str);
    describe('slackcommand()', function() {
      it('should be able to get command and command text from payload ', function() {
        let index = payload.search("command.*text");
        assert.notEqual(index,-1);
        console.log("payload : "+payload);
        let searchParams = new URLSearchParams(payload);
        assert.equal(true,searchParams.has("command"));
        let command = searchParams.get("command");
        let text = searchParams.get("text");
        console.log("command "+command);
        console.log("text "+text);
      });
    });
  });