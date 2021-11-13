const { ComponentDialog, WaterfallDialog, Dialog } = require('botbuilder-dialogs');
const { CardFactory } = require('botbuilder');

// DB Operations
const ProductDB = require('../database/productDB');
const CartDB = require('../database/cartDB');

// Cards
const CatalogCard = require('../cards/catalogCard');
const QuantityChageCard = require('../cards/quantityChangeCard');
const WelcomeCard = require('../cards/welcomeCard');

// Static Strings
const CONSTANT = require('../utils/constant');

class ProductDialog extends ComponentDialog {
    constructor(conversationState) {
        super(CONSTANT.ProductDialog);

        if (!conversationState) throw new Error('Conversation State is not found');
        this.conversationState = conversationState;

        this.addDialog(new WaterfallDialog(CONSTANT.productDialogWf1, [
            this.fetchCatalog.bind(this),
            this.handleItemAddToCart.bind(this),
            this.quantityUpdate.bind(this)
        ]));
        this.intialDialogId = CONSTANT.productDialogWf1;
    }

    async fetchCatalog(stepContext) {
        try {
            const prods = await ProductDB.fetchCatalog();
            const attachments = [];
            attachments.push(CardFactory.adaptiveCard(CatalogCard.card));
            attachments.push(CardFactory.adaptiveCard(CatalogCard.generateCatalogCard(prods)));
            await stepContext.context.sendActivity({
                text: 'Choose item to add to your cart:',
                attachments: attachments
            });
            return Dialog.EndOfTurn;
        } catch (error) {
            console.log(error.message);
        }
    }

    async handleItemAddToCart(sc) {
        if (sc.context.activity.value) {
            const id = sc.context.activity.value.id;
            const newQuantity = sc.context.activity.value[id];
            if (id) {
                const currentQuantity = await CartDB.checkExist(id);
                if (currentQuantity !== -1) {
                    const val = parseInt(newQuantity, 10) + parseInt(currentQuantity, 10);
                    await sc.context.sendActivity({
                        attachments: [CardFactory.adaptiveCard(QuantityChageCard.generateCard(id, newQuantity, val))]
                    });
                } else {
                    const result = await CartDB.addItemToCart(id, newQuantity);
                    if (result) {
                        await sc.context.sendActivity(CONSTANT.AddedToCart);
                    } else {
                        await sc.context.sendActivity(CONSTANT.GenericError);
                    }
                    return await sc.replaceDialog(CONSTANT.ProductDialog);
                }
            }
        } else {
            await sc.context.sendActivity({
                text: `${ CONSTANT.UnableMainMenuString }`,
                attachments: [CardFactory.adaptiveCard(WelcomeCard.generateWelcomeCard())]
            });
            return await sc.endDialog();
        }
    }

    async quantityUpdate(sc) {
        if (sc.context.activity.value) {
            const id = sc.context.activity.value.id;
            const action = sc.context.activity.value.action;
            if (action !== 'ca') {
                const amt = sc.context.activity.value.quantity;
                const result = await CartDB.updateItemQuantity(id, amt);
                if (result) {
                    await sc.context.sendActivity(CONSTANT.QuantityUpdated);
                } else {
                    await sc.context.sendActivity(CONSTANT.GenericError);
                }
            } else {
                await sc.context.sendActivity('Cancelled');
            }
            return await sc.replaceDialog(CONSTANT.ProductDialog);
        } else {
            await sc.context.sendActivity({
                text: `${ CONSTANT.UnableMainMenuString }`,
                attachments: [CardFactory.adaptiveCard(WelcomeCard.generateWelcomeCard())]
            });
            return await sc.endDialog();
        }
    }
}

module.exports.ProductDialog = ProductDialog;
