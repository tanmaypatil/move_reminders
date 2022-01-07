var assert = require('assert');
const querystring = require('querystring');
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('validate it is slack command ', function () {
  let str = "token=pqCXZIRS34rO16EyPC21pb11&team_id=T02EGJSRSCD&team_domain=bills-yyp4270&channel_id=C02EKKDHGDQ&channel_name=bill-notification&user_id=U02EY80NKAM&user_name=tany.patil77&command=%2Falarm&text=create+alarm+due+on&api_app_id=A02F90YP2JJ&is_enterprise_install=false&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT02EGJSRSCD%2F2886145261587%2F0v1WWSMAsz10qOS7aZemtqOn&trigger_id=2888404157860.2492638876421.75b9ee36440dafc39ffcf154566ed50d"
  let payload = querystring.unescape(str);
  describe('slackcommand()', function () {
    it('should be able to get command and command text from payload ', function () {
      let index = payload.search("command.*text");
      assert.notEqual(index, -1);
      console.log("payload : " + payload);
      let searchParams = new URLSearchParams(payload);
      assert.equal(true, searchParams.has("command"));
      let command = searchParams.get("command");
      let text = searchParams.get("text");
      console.log("command " + command);
      console.log("text " + text);
    });
  });
});

describe('validate slack command and due date  ', function () {
  let str = "'token=pqCXZIRS34rO16EyPC21pb11&team_id=T02EGJSRSCD&team_domain=bills-yyp4270&channel_id=C02EKKDHGDQ&channel_name=bill-notification&user_id=U02EY80NKAM&user_name=tany.patil77&command=%2Falarm&text=create+alarm+due+on+01-01-2022+repeat+monthly&api_app_id=A02F90YP2JJ&is_enterprise_install=false&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FT02EGJSRSCD%2F2910861095489%2FkgOHN6fJ6QKeUdCnhSZrMW5l&trigger_id=2891536823974.2492638876421.9a70d49a8af947d7221ec3718e83214e"
  let payload = querystring.unescape(str);
  describe('slackcommandduedate()', function () {
    it('should be able to get extract due date and repeat from payload ', function () {
      let index = payload.search("command.*text");
      assert.notEqual(index, -1);
      console.log("payload : " + payload);
      let searchParams = new URLSearchParams(payload);
      assert.equal(true, searchParams.has("command"));
      let command = searchParams.get("command");
      let text = searchParams.get("text");
      console.log("command " + command);
      console.log("text " + text);
    });
  });
});

describe('Validate a basic reggex ', function () {
  console.log('fourth test');
  describe('regexp()', function () {
    it('should be able to get extract due date using regex', function () {
      let str = 'create alarm due on 01-01-2022 repeat monthly';
      let regexpNames = /create alarm due on (?<dueDate>[0-9-]*)/mg;
      let match = regexpNames.exec(str);
      do {
        console.log(`Hello ${match.groups.dueDate}`);
      } while ((match = regexpNames.exec(str)) !== null)

    })
  });
});

//create alarm due on (?<dueDate>[0-9-]*)(?<repeat> repeat* monthly|daily)*

describe('Validate a basic reggex for capturing alarm frequency ', function () {
  console.log('fourth test');
  describe('regexp()', function () {
    it('should be able to get extract due date and frequency using regex', function () {
      let str = 'create alarm due on 01-01-2022 repeat monthly';
      let regexpNames = /create alarm due on (?<dueDate>[0-9-]*)\s(?<repeat>repeat* monthly|daily)*/mg;
      let match = regexpNames.exec(str);
      let dueDate = '01-01-2022'
      let repeat = 'repeat monthly';
      do {
        console.log(`dueDate ${match.groups.dueDate}`);
        console.log(`repeat ${match.groups.repeat}`);
        assert.equal(dueDate, `${match.groups.dueDate}`);
        assert.equal(repeat, `${match.groups.repeat}`);

      } while ((match = regexpNames.exec(str)) !== null)

    })
  });
});

describe('Validate a basic regex when no alarm frequency is given ', function () {
  console.log('fourth test');
  describe('regexp()', function () {
    it('should be able to get extract due date and frequency using regex', function () {
      let str = 'create alarm due on 01-01-2022 ';
      let regexpNames = /create alarm due on (?<dueDate>[0-9-]*)(?<repeat>\srepeat* monthly|daily)*/mg;
      let match = regexpNames.exec(str);
      let dueDate = '01-01-2022'
      let repeat = null;
      do {
        console.log(`dueDate ${match.groups.dueDate}`);
        console.log(`repeat ${match.groups.repeat}`);
        assert.equal(dueDate, `${match.groups.dueDate}`);
        assert.equal(undefined, match.groups.repeat);
      } while ((match = regexpNames.exec(str)) !== null)

    })
  });
});

