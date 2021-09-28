import { LocalProgramArgs, LocalWorkspace } from '@pulumi/pulumi/automation';

import * as express from 'express';
import * as bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const runUpdate = async (webhook: string, values: any) => {
  let result: any;

  try {
    const args: LocalProgramArgs = {
      stackName: 'staging',
      workDir: __dirname,
    };

    let envVars = {};

    if (values.menu_message) {
      envVars['MENU_MESSAGE'] = values.menu_message;
    }

    if (values.vote_message) {
      envVars['VOTE_MESSAGE'] = values.vote_message;
    }

    const stack = await LocalWorkspace.createOrSelectStack(args, {
      envVars,
    });

    console.info('successfully initialized stack');
    console.info('installing plugins...');
    await stack.setConfig('aws:region', { value: 'us-east-1' });
    console.info('config set');
    console.info('refreshing stack...');
    await stack.refresh({ onOutput: console.info });
    console.info('refresh complete');
    console.info('updating stack...');
    const upRes = await stack.up({ onOutput: console.info });
    console.log(
      `update summary: \n${JSON.stringify(
        upRes.summary.resourceChanges,
        null,
        4
      )}`
    );

    result = {
      message: 'Update complete',
      data: upRes.summary.resourceChanges,
    };
  } catch (err) {
    result = {
      error: 'Something went wrong',
      data: err,
    };
  }

  await axios.post(webhook, result);
};

app.post('/updateInfra', async (request, response) => {
  const {
    body: { webhook, menu_message, vote_message },
  } = request;

  if (webhook) {
    runUpdate(webhook, { menu_message, vote_message });
    response.status(200).send('Update started');
  } else {
    response.status(400).send('Some required param is missing');
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
