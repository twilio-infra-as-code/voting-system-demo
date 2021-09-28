const AWS = require('aws-sdk');

exports.handler = async function (context, event, callback) {
  const { Digits, From } = event;

  let twiml = new Twilio.twiml.VoiceResponse();

  if (Digits) {
    const dynamodb = new AWS.DynamoDB({ region: 'us-east-1' });

    var params = {
      Item: {
        PhoneNumber: {
          S: From,
        },
        Vote: {
          N: Digits,
        },
      },
      ReturnConsumedCapacity: 'TOTAL',
      TableName: 'Vote',
    };

    try {
      await new Promise((resolve, reject) => {
        dynamodb.putItem(params, function (err, data) {
          if (err) reject({ err, stack: err.stack });
          else resolve(data);
        });
      });

      twiml.say(`
                Thank you for your vote. 
                Your vote was computed as ${Digits}. Bye.`);
    } catch (err) {
      twiml.say('Something went wrong. Please call again later.');
      console.log(err);
    }
  } else {
    twiml.say('Vote was not recognized. Please call again later.');
  }

  callback(null, twiml);
};
