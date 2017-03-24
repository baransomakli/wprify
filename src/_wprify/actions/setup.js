'use strict';

module.exports = function (wf) {

    var questions = [
        {
            type: 'input',
            name: 'themeName',
            message: wf.l("ASK_THEME_NAME")
        },
        {
            type: 'input',
            name: 'wpUrl',
            message: wf.l('ASK_WP_URL')
        },
    ];

    wf.inquirer.prompt(questions).then(function (answers) {
        // console.log(JSON.stringify(answers));
        for (var k in answers) {
            wf.config.set(k, answers[k]);
        }
        wf.config.set('installed', true);
        wf.config.writeSync(null, '  ');
    });
};