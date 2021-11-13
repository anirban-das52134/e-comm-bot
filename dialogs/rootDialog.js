const { ComponentDialog, WaterfallDialog, DialogSet, DialogTurnStatus } = require('botbuilder-dialogs');

// Importing Required Dialogs
const { CartDialog } = require('./cartDialog');
const { ProductDialog } = require('./productDialog');

// Importing the String Constants
const CONSTANTS = require('../utils/constant');

class RootDialog extends ComponentDialog {
    constructor(conversationState) {
        super(CONSTANTS.RootDialog);

        if (!conversationState) throw new Error('Conversation State is not found');
        this.conversationState = conversationState;

        this.addDialog(
            new WaterfallDialog(CONSTANTS.rootDialogWf1, [this.messageHandler.bind(this)])
        );

        this.addDialog(new ProductDialog(conversationState));
        this.addDialog(new CartDialog(conversationState));

        this.initialDialogId = CONSTANTS.rootDialogWf1;
    }

    async messageHandler(sc) {
        try {
            const currentIntent = sc.context.activity.text;

            if (currentIntent.toLowerCase().includes('catalog')) {
                return await sc.beginDialog(CONSTANTS.ProductDialog);
            } else if (currentIntent.toLowerCase().includes('cart')) {
                return await sc.beginDialog(CONSTANTS.CartDialog);
            } else if (currentIntent.toLowerCase().includes('inquiry')) {
                await sc.context.sendActivity('Inquiry system is under development.');
            } else {
                await sc.context.sendActivity('Sorry, I am unable to understand your request.');
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
}

module.exports.RootDialog = RootDialog;
