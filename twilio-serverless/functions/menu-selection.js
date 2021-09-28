exports.handler = async function (context, event, callback) {
  const { Digits, From } = event;

  let twiml = new Twilio.twiml.VoiceResponse();

  switch (Digits) {
    case '1':
      twiml.redirect(
        {
          method: 'POST',
        },
        `/gather-vote?From=${From}`
      );
      break;
    // Add more menu selection here, e.g.
    // case '2':
    // break;
    default:
      twiml.say('Invalid option. Please try again');
  }

  callback(null, twiml);
};
