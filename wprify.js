#!/usr/bin/env node

var program = require('commander');
var exists = require('fs').existsSync;
var path = require('path');
var chalk = require('chalk');
var inquirer = require('inquirer');
var json = require('json-file');

var wf = {};

var wprifySrcFolder = './src/_wprify';
var _lang = 'tr';


/**
 * Options Setup
 */
program.usage('wprify [options] [action]')
    .version('0.0.1')
    .option('-l,--language [value]', 'Set language')
    .parse(process.argv);


/* Language Stuff */
if (program.language && exists(wprifySrcFolder + '/i18n/' + program.language + '.json')) {
    _lang = program.language;
}
var _langFile = wprifySrcFolder + '/i18n/' + _lang + '.json';
var language = null;

if (exists(_langFile)) {
    language = json.read(_langFile);
} else {
    console.log(chalk.blue('** Language file not exists ' + _langFile));
}

wf.l = function(key){
    "use strict";
    if (!language) {
        return key;
    }
    if (language.get(key)) {
        return language.get(key);
    }
    return key;
};


/* Config file */
var config = null;
if (!exists(wprifySrcFolder + '/config.json')) {
    console.log(chalk.white.bgRed.bold(wf.l('NO_CONFIG_FILE')));
    return;
} else {
    config = json.read(wprifySrcFolder + '/config.json');
}

wf.config=config;

if (config.get('installed')) {
    console.log(chalk.white.bgRed.bold(wf.l('ALREADY_INSTALLED')));
    return;
}

/* Quick Use */
program.on('--help', function () {
    console.log(' Examples:');
    console.log(' npm run setup');
});

if (program.args.length < 1) {
    return program.help();
}

/* Start */

var action = program.args[0];
var actionFile = wprifySrcFolder+'/actions/'+action+'.js';

wf.inquirer = inquirer;
wf.chalk = chalk;

if(exists(actionFile)){
    require(actionFile)(wf);
}