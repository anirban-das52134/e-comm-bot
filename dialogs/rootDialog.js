const { WaterfallDialog, DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
const { CardFactory } = require('botbuilder');
const WelcomeCard = require('../cards/welcomeCard');

// Importing Required Dialogs
const { CartDialog } = require('./cartDialog');
const { ProductDialog } = require('./productDialog');

// Importing the String Constants
const CONSTANT = require('../utils/constant');

class RootDialog extends CancelAndHelpDialog {
    constructor(conversationState) {
        super(CONSTANT.RootDialog, conversationState);

        if (!conversationState) throw new Error('Conversation State is not found');
        this.conversationState = conversationState;

        this.addDialog(
            new WaterfallDialog(CONSTANT.rootDialogWf1, [this.messageHandler.bind(this)])
        );

        this.addDialog(new ProductDialog(conversationState));
        this.addDialog(new CartDialog(conversationState));

        this.initialDialogId = CONSTANT.rootDialogWf1;
    }

    async messageHandler(sc) {
        try {
            const currentIntent = sc.context.activity.text;
            if (currentIntent.toLowerCase().includes('catalog')) {
                return await sc.beginDialog(CONSTANT.ProductDialog);
            } else if (currentIntent.toLowerCase().includes('cart')) {
                return await sc.beginDialog(CONSTANT.CartDialog);
            } else if (currentIntent.toLowerCase().includes('inquiry')) {
                await sc.context.sendActivity('Inquiry system is under development.');
            } else if (currentIntent.toLowerCase().includes('restart') || currentIntent.toLowerCase().includes('menu')) {
                await sc.context.sendActivity(CONSTANT.RestartMessageText);
                return await this.openMainMenu(sc);
            } else {
                await sc.context.sendActivity(CONSTANT.UnableMainMenuString);
                return await this.openMainMenu(sc);
            }
            return await sc.endDialog();
        } catch (error) {
            console.log(error);
        }
    }

    async run(context, accessor) {
        try {
            const dialogSet = new DialogSet(accessor);
            dialogSet.add(this);
            const dialogContext = await dialogSet.createContext(context);
            const results = await dialogContext.continueDialog();
            if (results && results.status === DialogTurnStatus.empty) {
                await dialogContext.beginDialog(this.id);
            } else {
                console.log('Dialog Stack is Empty');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async openMainMenu(sc) {
        return await sc.context.sendActivity({
            text: `${ CONSTANT.MenuHeader }`,
            attachments: [CardFactory.adaptiveCard(WelcomeCard.generateWelcomeCard())]
        });
    }
}

module.exports.RootDialog = RootDialog;
