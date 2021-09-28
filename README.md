# Voting system with Twilio Phone Numbers, Functions and AWS DynamoDB

A simple phone based voting system backed by Twilio Phone Numbers and Functions that receives the vote as a DTMF and stores it in AWS DynamobDB. 

This solution is used for the webinar: [Building Communication Workflows with Twilio, Pulumi, and AWS](https://ahoy.twilio.com/devgen_webinar_workflows_NAMER-1)

## Pre-requisites 

* [A Twilio account](https://www.twilio.com/try-twilio)
* [Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart) 
* [Twilio CLI `infra` plugin](https://github.com/twilio-infra-as-code/plugin-twilio-infra#install-the-pulumi-cli)
* [A Pulumi Account](https://app.pulumi.com/signup)
* [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/) 

## Deploying and running the program

1. Clone this project 
    ```bash
    $ git clone https://github.com/twilio-infra-as-code/voting-system
    ```
    
1. Install dependencies 

    ```bash 
    $ npm install
    ```

1. Select Twilio project / profile 
    ```bash 
    $ twilio profile:use <profile-name>
    ```

1.  Create a new stack called `dev`: 

    ```bash
    $ twilio infra:environment:new dev
    ```

1.  Set the AWS region:

    ```
    $ pulumi config set aws:region us-east-1
    ```

1. Create a new file called `.env.<stack-name>` (where `<environment-name>` is the name of the environment / Pulumi stack created above, e.g. `.env.dev`). The file should contain definition for the following variables: 
    * `AWS_ACCESS_KEY_ID`: AWS access key (to provision the dynamo DB)
    * `AWS_SECRET_ACCESS_KEY`AWS access key secret
    * `INCOMING_NUMBER_SID`: Twilio phone number sid (PNxxxxxxxxx)
    * `MENU_MESSAGE`: (optional) Default: `Welcome. Press 1 to leave a vote`
    * `VOTE_MESSAGE`: (optionl) Default: `Please enter your vote from 1 to 5`

1. Edit the file `Pulumi.dev.yaml` and add a value for the following variables: 
    * `voting-system:dynamoClientAccessKeyId`: AWS access key to create records in DynamoDB from Twilio serverless
    * `voting-system:dynamoClientSecretAccessKey`: AWS access key secret 

1.  Run the following command to preview and deploy changes:

    ```bash
    $ twilio infra:deploy
    ```

## Clean up

1.  Run the following command to tear down all resources:

    ```bash
    $ twilio infra:destroy
    ```

1.  To delete the stack itself you need to use the Pulumi CLI directly: 

    ```bash
    $ pulumi stack rm <environment-name>
    ```
    
    Note that this command deletes all deployment history from the Pulumi Console.
