const rp = require('request-promise'),
    Dialogs = require('./dialogs.js'),
    app = require('./appID.js');
    
module.exports.makeMenu = (session, _userid, _text, _keyboard, _menu, isDeleteMessage, callback) => {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot' + app.TELEGRAM_API + '/sendMessage',
        body: {
            'chat_id': _userid,
            'text': _text,
            'parse_mode': 'HTML',
            'reply_markup': JSON.stringify({
                "keyboard": _keyboard,
                "resize_keyboard": true
            }),
            'disable_web_page_preview': true
        },
        json: true // Automatically stringifies the body to JSON
    };
    rp(options, (err, res, req) => {
        if (req.ok == true) {
            console.log(req.result.message_id);

            if (isDeleteMessage == true) {
                Dialogs.deleteMessagesBefore(session, req.result.message_id);
            }

            session.userData.arrayMsg = [req.result.message_id];

            console.log('_______________');
            console.log(session.userData.dialog);
            console.log('_______________');
            Dialogs.changeDialogsChain(session, _menu);
            callback(req.result.message_id);
        }
    });
}

module.exports.makeMessage = (session, _userid, _text, callback) => {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot' + app.TELEGRAM_API + '/sendMessage',
        body: {
            'chat_id': _userid,
            'text': _text,
            'parse_mode': "Markdown"
        },
        json: true // Automatically stringifies the body to JSON
    };
    rp(options, (err, res, req) => {
        if (req.ok == true) {
            if (session.userData.arrayMsg != undefined)
                session.userData.arrayMsg.push(req.result.message_id);
            else
                session.userData.arrayMsg = [req.result.message_id];
            callback(req.result.message_id);
        }
    });
    rp.get('https://api.telegram.org/bot' + app.TELEGRAM_API + '/getWebhookInfo', (err, res, req) => {
        // console.log(req);
    });
}

module.exports.makeSimpleMessage = (_userid, _text) => {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot' + app.TELEGRAM_API + '/sendMessage',
        body: {
            'chat_id': _userid,
            'text': _text
        },
        json: true // Automatically stringifies the body to JSON
    };
    rp(options, (err, res, req) => {

    });
}


module.exports.replaceMenu = (_userid, _messageid) => {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot' + app.TELEGRAM_API + '/editMessageText',
        body: {
            'chat_id': _userid,
            'message_id': _messageid,
            'text': 'Т',
        },
        json: true // Automatically stringifies the body to JSON
    };
    rp(options, (err, res, req) => {
        console.log(req);
    });
}

module.exports.replaceMenuMarkup = (_userid, _messageid, _markup) => {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot' + app.TELEGRAM_API + '/editMessageReplyMarkup',
        body: {
            'chat_id': _userid,
            'message_id': _messageid,
            'reply_markup': JSON.stringify({
                "keyboard": _markup
            })
        },
        json: true // Automatically stringifies the body to JSON
    };
    rp(options, (err, res, req) => {
        console.log(req);
    });
}

module.exports.replaceMenuCaption = (_userid, _messageid) => {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot' + app.TELEGRAM_API + '/editMessageCaption',
        body: {
            'chat_id': _userid,
            'message_id': _messageid,
            'text': "ti pidor"
        },
        json: true // Automatically stringifies the body to JSON
    };
    rp(options, (err, res, req) => {
        console.log(req);
    });
}



module.exports.deleteLastMessage = (_userid, _messageid) => {
    var options = {
        method: 'POST',
        uri: 'https://api.telegram.org/bot' + app.TELEGRAM_API + '/deleteMessage',
        body: {
            'chat_id': _userid,
            'message_id': _messageid
        },
        json: true // Automatically stringifies the body to JSON
    };
    rp(options, (err, res, req) => {
        console.log(req);
    });
}