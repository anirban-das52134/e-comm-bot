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

        this.previousIntent = this.conversationState.createProperty('previousIntent');
        this.conversationData = this.conversationState.createProperty('conversationData');

        this.addDialog(
            new WaterfallDialog(CONSTANTS.rootDialogWf1, [this.messageHandler.bind(this)])
        );

        this.addDialog(new ProductDialog(conversationState));
        this.addDialog(new CartDialog(conversationState));

        this.initialDialogId = CONSTANTS.rootDialogWf1;
    }

    async messageHandler(stepContext) {
        try {
            console.log('Inside ROOT');
            var currentIntent = '';
            const previousIntent = await this.previousIntent.get(stepContext.context, {});
            const conversationData = await this.conversationData.get(stepContext.context, {});

            if (previousIntent.intentName && conversationData.endDialog === false) {
                currentIntent = previousIntent.intentName;
            } else if (previousIntent.intentName && conversationData.endDialog === true) {
                currentIntent = stepContext.context.activity.text;
            } else {
                currentIntent = stepContext.context.activity.text;
                await this.previousIntent.set(stepContext.context, { intentName: stepContext.context.activity.text });
            }

            console.log(currentIntent);

            if (currentIntent.toLowerCase().includes('catalog')) {
                return await stepContext.beginDialog(CONSTANTS.ProductDialog);
            } else if (currentIntent.toLowerCase().includes('cart')) {
                return await stepContext.beginDialog(CONSTANTS.CartDialog);
            } else if (currentIntent.toLowerCase().includes('inquiry')) {
                await stepContext.context.sendActivity('Inquiry system is under development.');
            } else {
                await stepContext.context.sendActivity('Sorry, I am unable to understand your request.');
            }
            return await stepContext.endDialog();
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
