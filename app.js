const Server = require("./server.js"),
    db = require("./db.js"),
    builder = require('botbuilder'),
    rp = require('request-promise'),
    Menu = require('./replaceMenu.js'),
    Dialogs = require('./dialogs.js'),
    Key = require('./buttons.js');


var bot = new builder.UniversalBot(Server.connector, [
    (session) => {
        session.beginDialog('start');
    }
]).set('storage', Server.memory);

bot.dialog("start", [
    (session, args, next) => {
        let msg = "Главное меню";
        Menu.makeMenu(session, session.message.user.id, msg, Key.keyboards.mainMenu, 'start', false, (msg_id) => {
            // Тут пиши тело функции
            next();
        });
    }
]);

bot.dialog("organisation", [
    (session, args, next) => {
        let msg = "Тут весь контроль организации";
        Menu.makeMenu(session, session.message.user.id, msg, Key.keyboards.organisation, 'organisation', false, (msg_id) => {
            // Тут пиши тело функции
            next();
        });
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_organisation
});

bot.dialog("investor", [
    (session, args, next) => {
        let msg = "Тут весь контроль инвестора (простого смертного)";
        Menu.makeMenu(session, session.message.user.id, msg, Key.keyboards.investor, 'investor', false, (msg_id) => {
            // Тут пиши тело функции
            next();
        });
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_investor
});

bot.dialog("create_vote", [
    (session, args, next) => {
        session.send('Создать голосование');
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_create_vote
});

bot.dialog("sacrifice", [
    (session, args, next) => {
        session.send('Пожертовать');
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_sacrifice
});

bot.dialog("vote", [
    (session, args, next) => {
        session.send('Проголосвать');
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_vote
});

bot.dialog('back', [
    (session, err) => {

        var dialogArr = session.userData.lastDialog;

        if (dialogArr != undefined && dialogArr.length != 0) {
            // создаётся для того, чтоб индексы не уменьшались
            var arrLength = dialogArr.length;

            var dialogArrCur = session.userData.dialog;

            // Проверка на спам одним и тем же диалогом
            var i = 0;
            for (var j = 0; j < arrLength; j++) {
                if (dialogArr[j - i] == dialogArrCur[dialogArrCur.length - 1]) {
                    dialogArr.splice(j - i, 1);
                    i = i + 1;
                }
            }

            var newDialogArr = dialogArr.slice(0, dialogArr.length - 1);

            session.userData.dialog = newDialogArr;
            

            if (dialogArr.length - 1 < 0) {
                session.beginDialog('start');
            } else {
                session.beginDialog(dialogArr[dialogArr.length - 1]);
            }

        } else {
            session.beginDialog('start');
        }
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_back
});