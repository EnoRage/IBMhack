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
                session.beginDialog('start');
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

bot.dialog("balance", [
    (session, args, next) => {
        db.user.balance(session.message.user.id, (balance) => {
            session.send('Ваш баланс: ' + balance + " у.е.");
        })
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_balance
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


bot.dialog("vote", [
    (session, args, next) => {
        db.organisation.findAll((organisations) => {
            db.user.find(session.message.user.id, (user) => {
                session.userData.userOrganisations = user[0].organisations;
                console.log('aaa')
                var counter = 0;
                org_object = [];
                var organisationNames = [];
                for (let i in organisations) {
                    for (let j in session.userData.userOrganisations) {
                        if (organisations[i].organisationID == session.userData.userOrganisations[j].organisationID) {
                            counter++;
                            organisationNames.push(organisations[i].name);
                            console.log('dddd')
                            return;
                        }
                    }
                }

                if (counter != 0) {
                    builder.Prompts.choice(session, "Чтобы посмотреть активные голосования - выберите организацию", organisationNames, {
                        listStyle: builder.ListStyle.button
                    });
                } else {
                    session.send('Вы ещё не пожертвовали ни в одну организацию');
                    return;
                }
            });
        });
    },
    (session, results, next) => {
        for (let i in org_object) {
            if (org_object[i].name == results.response.entity) {
                organisation = org_object[i];
            }
        }

        var counter = 0;
        db.vote.findAll((votes) => {
            for (let i in votes) {
                for (let j in session.userData.userOrganisations) {
                    if (votes[i].organisationID == session.userData.userOrganisations[j].organisationID) {
                        counter++;
                        let msg = 'Организация: ' + '**' + organisation.name + '**' + 'планирует собрать **' + votes[i].sum + ' у.е.**, ' + '+чтобы **' + votes[i].description + '**\n\n\0\n\nВы одобряете?';
                        let card = Card.voteCard(session, msg, votes[i].voteID);
                        var text = new builder.Message(session).addAttachment(card);
                        session.send(text);
                    }
                }
            }

            if (counter == 0) {
                session.send('Организация ещё не проводила голосования');
                return;
            }
        })
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_vote
});

bot.dialog("sacrifice", [
    (session, args, next) => {
        db.organisation.findAll((organisations) => {
            org_object = organisations;
            var organisationNames = [];
            for (let i in organisations) {
                organisationNames.push(organisations[i].name);
            }
            builder.Prompts.choice(session, "Выберите организацию, в которую хотите пожертвовать", organisationNames, {
                listStyle: builder.ListStyle.button
            });
        });
    },
    (session, results) => {

        for (let i in org_object) {
            if (org_object[i].name == results.response.entity) {
                organisation = org_object[i];
            }
        }

        let msg = '**Вы выбрали:** ' + organisation.name + '\n\n\0\n\n' +
            '**Страна:** ' + organisation.country + '\n\n' +
            '**Состояние**: ' + organisation.capital + 'млрд. дол.\n\n' +
            '**Цель:** ' + organisation.mission;
        session.send(msg);
        db.user.balance(session.message.user.id, (balance) => {
            builder.Prompts.text(session, "Вам **доступно** " + balance + " у.е.\n\n\0\n\nВведите сумму пожертвования");
        });
    },
    (session, results, next) => {
        db.user.addOrganisation(session.message.user.id, organisation.organisationID, results.response);
        db.user.updateBalance(session.message.user.id, results.response);
        db.organisation.updateBalance(organisation.organisationID, results.response);
        session.send('Вы успешно пожертвовали ' + results.response + ' у.е.');
        next();
    }
]).triggerAction({
    matches: Key.buttons.regular_expression.btn_sacrifice
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