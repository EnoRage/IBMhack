const Menu = require('./replaceMenu.js');

function changeDialogsChain (session, thisDialog) {
    if (session.userData.dialog === undefined) {
        console.log('Попал в ИФ');
        session.userData.dialog = ['SecondMenu']; // Стартовый диалог
        session.userData.lastDialog = undefined;
    }

    var currentDialog = safeAddDialogs(session.userData.dialog, thisDialog);
    session.userData.dialog = currentDialog;
    var last = currentDialog.slice(0, currentDialog.length-1);
    if (last.length != 0) {
        session.userData.lastDialog = last;
    }
}

module.exports.deleteMessagesBefore = (session, msg_id) => {   
    if (session.userData.arrayMsg != undefined && msg_id != undefined) {
      let arrayMsg = session.userData.arrayMsg;
      for (let i in arrayMsg) {
        Menu.deleteLastMessage(session.message.user.id, arrayMsg[i]);
      }
      session.userData.arrayMsg = undefined;
      
    } else {
        session.userData.arrayMsg = [msg_id];
    }
}

function safeAddDialogs(lastDialog,newDialog) {
    var err = 0;

    if (lastDialog[lastDialog.length - 1] == newDialog) {
        err = err + 1;
    }
    
    if (err == 0) {
        let newUserData = lastDialog;
        newUserData.push(newDialog);
        return newUserData;
    } else {
        return lastDialog;
    }
};

module.exports.safeAddDialogs = safeAddDialogs;
module.exports.changeDialogsChain = changeDialogsChain;