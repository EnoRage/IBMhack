const Server = require("./server.js"),
    db = require("./db.js"),
    utils = require('./utils.js'),
    builder = require('botbuilder'),
    rp = require('request-promise'),
    Menu = require('./replaceMenu.js'),
    Dialogs = require('./dialogs.js'),
    Key = require('./buttons.js'),
    Card = require('./cards.js');

var org_object;
var organisation;

var bot = new builder.UniversalBot(Server.connector, [
    (session) => {
        session.beginDialog('start');
    }
]).set('storage', Server.memory);

bot.dialog("start", [
    (session, args, next) => {
        db.user.find(session.message.user.id, (user) => {
            if (user.length != 0) {
                let msg = "Главное меню";
                Menu.makeMenu(session, session.message.user.id, msg, Key.keyboards.mainMenu, 'start', false, (msg_id) => {
                    // Тут пиши тело функции
                    next();
                });
            } else {
                db.user.create(session.message.user.id, session.message.user.name);
                let msg = "Главное меню";
                Menu.makeMenu(session, session.message.user.id, msg, Key.keyboards.mainMenu, 'start', false, (msg_id) => {
                    // Тут пиши тело функции
                    next();
                });
            }
        })
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



bot.dialog("create_vote", [
    (session, args, next) => {
        db.organisation.findAll((organisations) => {
            org_object = organisations;
            var organisationNames = [];
            for (let i in organisations) {
                organisationNames.push(organisations[i].name);
            }
            builder.Prompts.choice(session, "Организация, которая создаёт голосование", organisationNames, {
                listStyle: builder.ListStyle.button
            });
        });
    },
    (session, results, next) => {
        for (let i in org_object) {
            if (org_object[i].name == results.response.entity) {
                organisation = org_object[i];
            }
        }

        builder.Prompts.text(session, "Введите описание пожертвования");
    },
    (session, results, next) => {
        session.userData.description = results.response;
        builder.Prompts.number(session, "Введите необходимую сумму");
    },
    (session, results, next) => {
        session.userData.sum = results.response;
        builder.Prompts.time(session, "Введите дату окончания голосования");
    },
    (session, results, next) => {
        let endDate = new Date(builder.EntityRecognizer.resolveTime([results.response])).getTime();
        db.vote.create(organisation.organisationID, session.userData.description, session.userData.sum, endDate);
        session.send('Голосование успешно создано');
        next();
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_create_vote
});

bot.dialog("show_votes", [
    (session, args, next) => {
        var options = {
            method: 'GET',
            uri: 'http://rosum-rigovon.westeurope.cloudapp.azure.com:3000/api/queries/AllOrgs',
            json: true
        };

        rp(options)
            .then(function (parsedBody) {
                for (let i in parsedBody) {
                    let msg = 'ID организации: ' + parsedBody[i].id + '\n\nInfo: ' + parsedBody[i].info + '\n\nБаланс: ' + parsedBody[i].balance;
                    session.send(msg);
                }
            })
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_show_votes
}
);

bot.dialog("show_tokens", [
    (session, args, next) => {
        var options = {
            method: 'GET',
            uri: 'http://rosum-rigovon.westeurope.cloudapp.azure.com:3000/api/Token',
            json: true
        };

        rp(options)
            .then(function (parsedBody) {
                for (let i in parsedBody) {
                    let msg = 'ID токена: ' + parsedBody[i].id + '\n\nНазвание токена: ' + parsedBody[i].name + '\n\nБаланс: ' + parsedBody[i].balance 
                    + '\n\nЦена токена: '+ parsedBody[i].proposedPrice + '\n\nВладелец токена (инвестор): '+parsedBody[i].holder + '\n\nВладелец токена (организация)' + parsedBody[i].absoluteOwner;
                    session.send(msg);
                }
            })
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_show_tokens
}
);

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