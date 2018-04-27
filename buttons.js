// Кнопки
const buttons = {
    regular_expression: {
        btn_organisation: /Организация/i,
        btn_investor: /Инвестор/i,
        btn_back: /❌  Назад/i,
        btn_add_organisation: /Добавить организацию/i,
        btn_create_vote: /Создать голосование/i,
        btn_sacrifice: /Пожертвовать/i,
        btn_vote: /Проголосвать/i
    },
    normal_buttons: {
        btn_organisation: 'Организация',
        btn_investor: 'Инвестор',
        btn_back: '❌  Назад',
        btn_add_organisation: 'Добавить организацию',
        btn_create_vote: 'Создать голосование',
        btn_sacrifice: 'Пожертвовать',
        btn_vote: 'Проголосвать'
    }
}



// Клавиатуры
const keyboards = {
    mainMenu: [
        [{
            text: buttons.normal_buttons.btn_organisation
        }],
        [{
            text: buttons.normal_buttons.btn_investor
        }],
        [{
            text: buttons.normal_buttons.btn_back
        }]
    ],

    organisation: [
        [{
            text: buttons.normal_buttons.btn_add_organisation
        }, {
            text: buttons.normal_buttons.btn_create_vote
        }]
    ],

    investor: [
        [{
            text: buttons.normal_buttons.btn_sacrifice
        }, {
            text: buttons.normal_buttons.btn_vote
        }]
    ]
}

module.exports.buttons = buttons;
module.exports.keyboards = keyboards;