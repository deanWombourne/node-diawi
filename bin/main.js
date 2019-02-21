#!/usr/bin/env node

const Diawi = require('../diawi.js');

const argv = require('yargs')
    .scriptName('diawi')
    .usage('$0 <cmd> args]')
    .command(['upload <token> <file>', '$0'],
        'Uploads an ipa, apk or zip to Diawi', (yargs) => {
          yargs
              .positional('token', {
                describe: 'your API access token',
                type: 'string',
              })
              .positional('file', {
                describe: 'the .ipa/.apk/.zip(.app) file',
                type: 'string',
              })
              .option('password', {
                alias: 'p',
                describe: 'protect your app with a password: it will be required to access the installation page',
                type: 'string',
              })
              .option('callbackUrl', {
                alias: 'u',
                describe: 'the URL Diawi should call with the result',
                type: 'string',
              })
              .option('recipients', {
                alias: 'r',
                describe: 'the email addresses Diawi will send the result to (up to 5 separated by commas for starter/premium/enterprise accounts, 1 for free accounts)',
                type: 'string',
              })
              .option('wall_of_apps', {
                alias: 'w',
                describe: 'allow Diawi to display the app\'s icon on the wall of apps',
                default: false,
                type: 'boolean',
              })
              .option('find_by_udid', {
                alias: 'f',
                describe: 'allow your testers to find the app on Diawi\'s mobile web app using their UDID (iOS only)',
                default: false,
                type: 'boolean',
              })
              .option('installation_notifications', {
                alias: 'i',
                describe: 'receive notifications each time someone installs the app (only starter/premium/enterprise accounts)',
                default: false,
                type: 'boolean',
              })
              .option('dry_run', {
                describe: 'only parse the arguments without executing the upload',
                default: false,
                type: 'boolean',
              })
              .option('comment', {
                alias: 'c',
                describe: 'additional information to your users on this build: the comment will be displayed on the installation page',
                type: 'string',
              });
        })
    .demandCommand()
    .help()
    .argv;

console.log(argv);

const opts = {
  token: argv.token,
  path: argv.file,
  password: argv.password,
  callback_url: argv.callbackUrl,
  callback_emails: argv.recipients,
  wall_of_apps: argv.wall_of_apps === true ? 1 : 0,
  installation_notifications: argv.installation_notifications === true ? 1 : 0,
  find_by_udid: argv.find_by_udid === true ? 1 : 0,
  comment: argv.comment,
};
const diawiCommand = new Diawi(opts)
    .on('complete', function(url) {
      console.log(url);
    })
    .on('error', function(error) {
      console.log('Failed: ', error);
      process.exit(1);
    });
const command = argv._[0] || 'upload';

switch (command) {
  case 'upload':
    if (!argv.dry_run) {
      diawiCommand.execute();
    }
    break;

  default:
    console.log('Unknown command: ', command);
    break;
}
