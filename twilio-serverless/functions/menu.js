exports.handler = async function (context, event, callback) {
  const { From } = event;
  const { MENU_MESSAGE } = context;

  let twiml = new Twilio.twiml.VoiceResponse();

  const gather = twiml.gather({
    action: `/menu-selection?From=${From}`,
    method: 'POST',
  });
  gather.say(MENU_MESSAGE);
  
  twiml.say("We didn't receive any input. Please try again");
  callback(null, twiml);
};
