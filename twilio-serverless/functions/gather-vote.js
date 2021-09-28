exports.handler = async function(context, event, callback) {

    const { From } = event;
    const { VOTE_MESSAGE } = context;

    let twiml = new Twilio.twiml.VoiceResponse();
    const gather = twiml.gather({
        action: `/save-vote?From=${From}`,
        method: 'POST'
    });
    gather.say(VOTE_MESSAGE);
    twiml.say('We didn\'t receive any input. Goodbye!');

    callback(null, twiml);

};
