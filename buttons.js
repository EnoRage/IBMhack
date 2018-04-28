// Кнопки
const buttons = {
    regular_expression: {
        btn_organisation: /Организация/i,
        btn_investor: /Инвестор/i,
        btn_back: /❌  Назад/i,
        btn_create_vote: /Создать голосование/i,
        btn_sacrifice: /Пожертвовать/i,
        btn_vote: /Проголосвать/i,
        btn_balance: /Баланс/i,
        btn_doVote: /Проголосовать/i,
        btn_statistica: /Статистика/i,
        btn_show_votes: /Показать организации/i,
        btn_show_tokens: /Показать токены/i,
    },
    normal_buttons: {
        btn_organisation: 'Организация',
        btn_investor: 'Инвестор',
        btn_back: '❌  Назад',
        btn_create_vote: 'Создать голосование',
        btn_sacrifice: 'Пожертвовать',
        btn_vote: 'Проголосвать',
        btn_balance: 'Баланс',
        btn_doVote: 'Проголосовать',
        btn_statistica: 'Статистика',
        btn_show_votes: 'Показать организации',
        btn_show_tokens: 'Показать токены',
    }
}



// Клавиатуры
const keyboards = {
    mainMenu: [
        [{
            text: buttons.normal_buttons.btn_organisation
        }],
        [{
                text: buttons.normal_buttons.btn_show_votes
            },
            {
                text: buttons.normal_buttons.btn_show_tokens
            }
        ]
    ],

    organisation: [
        [{
            text: buttons.normal_buttons.btn_create_vote
        }],
        [{
            text: buttons.normal_buttons.btn_back
        }]
    ],

    investor: [
        [{
            text: buttons.normal_buttons.btn_balance
        }],
        [{
            text: buttons.normal_buttons.btn_sacrifice
        }, {
            text: buttons.normal_buttons.btn_vote
        }],
        [{
            text: buttons.normal_buttons.btn_back
        }]
    ]
}

module.exports.buttons = buttons;
module.exports.keyboards = keyboards;