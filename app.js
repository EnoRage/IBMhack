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
    (session, args) => {
        session.send('Организация');
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_organisation
});

bot.dialog("investor", [
    (session, args) => {
        session.send('Инвестор');
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_investor
});

bot.dialog("add_organisation", [
    (session, args) => {
        session.send('Добавить орагнизацию');
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_add_organisation
});

bot.dialog("create_vote", [
    (session, args) => {
        session.send('Создать голосование');
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_create_vote
});

bot.dialog("sacrifice", [
    (session, args) => {
        session.send('Пожертовать');
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_sacrifice
});

bot.dialog("create_vote", [
    (session, args) => {
        session.send('Создать голосование');
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_create_vote
});

bot.dialog("vote", [
    (session, args) => {
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
            session.beginDialog(dialogArr[dialogArr.length - 1]);

        } else {
            session.beginDialog('start');
        }
    }
]).triggerAction({
    matches: /❌  Назад/i
});