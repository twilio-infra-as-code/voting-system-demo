import * as aws from "@pulumi/aws";
import * as pulumi from '@pulumi/pulumi';
import { Serverless, CheckServerless, Resource } from 'twilio-pulumi-provider';

const stack = pulumi.getStack();

const serviceName = 'voting-service';
const domain = CheckServerless.getDomainName(serviceName, stack);
const pulumiConfig = new pulumi.Config();
const dynamoClientAccessKeyId = pulumiConfig.requireSecret("dynamoClientAccessKeyId");
const dynamoClientSecretAccessKey = pulumiConfig.requireSecret("dynamoClientSecretAccessKey");

const { 
  INCOMING_NUMBER_SID,
  MENU_MESSAGE,
  VOTE_MESSAGE 
} = process.env;

const table = new aws.dynamodb.Table("Vote", {
    name: "Vote",
    attributes: [
      {
        name: "PhoneNumber",
        type: "S",
      }
    ],
    hashKey: "PhoneNumber",
    readCapacity: 5,
    writeCapacity: 5,
    streamEnabled: true,
    streamViewType: "NEW_AND_OLD_IMAGES",
});

const incomingNumber = new Resource(`incoming-number-for-vote`, {
  resource: ["incomingPhoneNumbers"],
  attributes: {
     sid: INCOMING_NUMBER_SID,
     voiceUrl: 
      pulumi.interpolate `https://${domain}/menu`
  }
});

const serverless = new Serverless(serviceName, {
  attributes: {
      cwd: `./twilio-serverless`,
      serviceName,          
      env: {
        AWS_ACCESS_KEY_ID: dynamoClientAccessKeyId, 
        AWS_SECRET_ACCESS_KEY: dynamoClientSecretAccessKey,
        MENU_MESSAGE: MENU_MESSAGE || `
          Welcome. Press 1 to leave a vote
        `,
        VOTE_MESSAGE: VOTE_MESSAGE || 'Please enter your vote from 1 to 5'
      },
      functionsEnv: stack,
      pkgJson: require("./twilio-serverless/package.json")
  }
});