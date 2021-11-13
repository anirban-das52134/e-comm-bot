const { WaterfallDialog, Dialog } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');
const { CancelAndHelpDialog } = require('./cancelAndHelpDialog');
// DB Operations
const CartDB = require('../database/cartDB');
const UserDB = require('../database/userDB');

// Cards
const CartCard = require('../cards/cartCard');
const UserForm = require('../cards/userInfoCard');
const WelcomeCard = require('../cards/welcomeCard');

// Static Strings
const CONSTANT = require('../utils/constant');

class CartDialog extends CancelAndHelpDialog {
    constructor(conversationState) {
        super(CONSTANT.CartDialog, conversationState);

        if (!conversationState) throw new Error('Conversation State is not found');
        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(CONSTANT.cartDialogWf1, [
            this.ShowCart.bind(this),
            this.HandleBuyOrDelete.bind(this),
            this.UserDetailResponse.bind(this)
        ]));

        this.intialDialogId = CONSTANT.cartDialogWf1;
    }

    async ShowCart(sc) {
        try {
            await sc.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(CartCard.card)]
            });
            await sc.context.sendActivity({
                attachments: [CardFactory.adaptiveCard(CartCard.generateCartCard(await CartDB.fetchCart()))]
            });
            return Dialog.EndOfTurn;
        } catch (error) {
            console.log(error);
        }
    }

    async HandleBuyOrDelete(sc) {
        if (sc.context.activity.value) {
            const action = sc.context.activity.value.action;
            var res;
            switch (action) {
            case 'del':
                res = await CartDB.deleteItem(sc.context.activity.value.id);
                if (res) {
                    await sc.context.sendActivity(CONSTANT.DeletedFromCart);
                } else {
                    await sc.context.sendActivity(CONSTANT.GenericError);
                }
                return await sc.replaceDialog(CONSTANT.CartDialog);
            case 'buy':
                await sc.context.sendActivity({
                    text: `${ CONSTANT.UserDetail }`,
                    attachments: [CardFactory.adaptiveCard(UserForm.card)]
                });
                break;
            }
        }
    }

    async UserDetailResponse(sc) {
        if (sc.context.activity.value) {
            const result = await UserDB.addUser(sc.context.activity.value);
            if (result) {
                await sc.context.sendActivity(CONSTANT.UserAdded);

                await sc.context.sendActivity({
                    text: 'Choose an option from below to get started :',
                    attachments: [CardFactory.adaptiveCard(WelcomeCard.generateWelcomeCard())]
                });

                return await sc.endDialog();
            } else {
                await sc.context.sendActivity(CONSTANT.GenericError);

                return await sc.replaceDialog(CONSTANT.CartDialog);
            }
        }
    }
}

module.exports.CartDialog = CartDialog;
