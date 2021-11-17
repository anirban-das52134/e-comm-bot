const { ComponentDialog, DialogTurnStatus } = require('botbuilder-dialogs');
const { InputHints } = require('botbuilder');
const { CardFactory } = require('botbuilder');
const WelcomeCard = require('../cards/welcomeCard');
// Static Strings
const CONSTANT = require('../utils/constant');
class CancelAndHelpDialog extends ComponentDialog {
    constructor(dialog, conversationState) {
        super(dialog);

        if (!conversationState) throw new Error('Conversation State is not found');
        this.conversationState = conversationState;
        this.dialog = dialog;
    }

    async onContinueDialog(dc) {
        const result = await this.interruptionHandler(dc);
        if (result) {
            return result;
        }
        return await super.onContinueDialog(dc);
    }

    async interruptionHandler(dc) {
        if (dc.context.activity.text) {
            const text = dc.context.activity.text.toLowerCase();
            if (text.includes('hi') || text.includes('hello')) {
                await dc.cancelAllDialogs();
                await dc.context.sendActivity(CONSTANT.WelcomeText);
                await dc.context.sendActivity(CONSTANT.WelcomeText2);
                await dc.context.sendActivity({
                    text: 'Choose an option from below to get started :',
                    attachments: [CardFactory.adaptiveCard(WelcomeCard.generateWelcomeCard())]
                });
            } else if (text.includes('help')) {
                await dc.context.sendActivity(CONSTANT.HelpMessageText, CONSTANT.HelpMessageText, InputHints.ExpectingInput);
                return { status: DialogTurnStatus.waiting };
            } else if (text.includes('restart')) {
                await dc.context.sendActivity(CONSTANT.RestartMessageText, CONSTANT.RestartMessageText, InputHints.IgnoringInput);
                return await dc.replaceDialog(this.dialog);
            } else if (text.includes('cancel') || text.includes('quit') || text.includes('exit')) {
                await dc.context.sendActivity(CONSTANT.CancelMessageText, CONSTANT.CancelMessageText, InputHints.IgnoringInput);
                return await dc.cancelAllDialogs();
            } else if (text.includes('menu')) {
                await dc.context.sendActivity(CONSTANT.MenuMessageText, CONSTANT.MenuMessageText, InputHints.IgnoringInput);
                await dc.cancelAllDialogs();
                return await dc.context.sendActivity({
                    text: `${ CONSTANT.MenuHeader }`,
                    attachments: [CardFactory.adaptiveCard(WelcomeCard.generateWelcomeCard())]
                });
            } else if (text.includes('cart')) {
                return await dc.replaceDialog(CONSTANT.CartDialog);
            } else if (text.includes('catalog')) {
                return await dc.replaceDialog(CONSTANT.ProductDialog);
            } else {
                await dc.context.sendActivity(CONSTANT.UnableMainMenuString, CONSTANT.UnableMainMenuString, InputHints.IgnoringInput);
                await dc.cancelAllDialogs();
                return await dc.context.sendActivity({
                    text: `${ CONSTANT.MenuHeader }`,
                    attachments: [CardFactory.adaptiveCard(WelcomeCard.generateWelcomeCard())]
                });
            }
        }
    }
}

module.exports.CancelAndHelpDialog = CancelAndHelpDialog;
