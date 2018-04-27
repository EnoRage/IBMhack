const Server = require("./server.js"),
    db = require("./db.js"),
    builder = require('botbuilder'),
    rp = require('request-promise');


var bot = new builder.UniversalBot(Server.connector, [
    (session) => {
        session.beginDialog('start');
    }
]).set('storage', Server.memory);

bot.dialog("start", [
    (session, args, next) => {
        builder.Prompts.choice(session, `Главное меню`, 'Организация|Инвестор', {
            listStyle: builder.ListStyle.button
        });
    },
    (session, results) => {
        switch (results.response.index) {
            case 0:
                session.beginDialog('organisation');
                break;
            case 1:
                session.beginDialog('investor');
                break;
        }
    }
]);

bot.dialog("organisation", [
    (session, args) => {
        session.send('Организация');
    }
]);

bot.dialog("investor", [
    (session, args) => {
        session.send('Инвестор');
    }
]);