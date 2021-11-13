const { TeamsActivityHandler, CardFactory } = require('botbuilder');
const welcomeCard = require('../cards/welcomeCard');

class EchoBot extends TeamsActivityHandler {
    constructor(conversationState, dialog) {
        super();

        if (!conversationState) throw new Error('Conversation State is not found');
        if (!dialog) throw new Error('[DialogBot]: Missing parameter. dialog is required');

        this.conversationState = conversationState;
        this.dialog = dialog;

        // Creating a Accessor for using in dialogs
        this.accessor = this.conversationState.createProperty('DialogAccessor');

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity({
                        text: 'Choose an option from below to get started :',
                        attachments: [CardFactory.adaptiveCard(welcomeCard.generateWelcomeCard())]
                    });
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMessage(async (context, next) => {
            await this.dialog.run(context, this.accessor);
            await next();
        });

        this.onDialog(async (context, next) => {
            await this.conversationState.saveChanges(context, false);
            await next();
        });
    }
}

module.exports.EchoBot = EchoBot;
