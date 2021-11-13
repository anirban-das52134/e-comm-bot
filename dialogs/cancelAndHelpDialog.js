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

            switch (text) {
            case 'help':
            case '?':
                await dc.context.sendActivity(CONSTANT.HelpMessageText, CONSTANT.HelpMessageText, InputHints.ExpectingInput);
                return { status: DialogTurnStatus.waiting };
            case 'restart':
                await dc.context.sendActivity(CONSTANT.RestartMessageText, CONSTANT.RestartMessageText, InputHints.IgnoringInput);
                return await dc.replaceDialog(this.dialog);
            case 'cancel':
            case 'quit':
            case 'exit':
                await dc.context.sendActivity(CONSTANT.CancelMessageText, CONSTANT.CancelMessageText, InputHints.IgnoringInput);
                return await dc.cancelAllDialogs();

            // Quick Options
            case 'menu':
                await dc.context.sendActivity(CONSTANT.MenuMessageText, CONSTANT.MenuMessageText, InputHints.IgnoringInput);
                await dc.cancelAllDialogs();
                return await dc.context.sendActivity({
                    text: `${ CONSTANT.MenuHeader }`,
                    attachments: [CardFactory.adaptiveCard(WelcomeCard.generateWelcomeCard())]
                });
            case 'cart':
                return await dc.replaceDialog(CONSTANT.CartDialog);
            case 'catalog':
                return await dc.replaceDialog(CONSTANT.ProductDialog);

            default:
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
