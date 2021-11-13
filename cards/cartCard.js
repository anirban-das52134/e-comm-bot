var card = {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.3',
    body: [
        {
            type: 'TextBlock',
            text: 'Your Cart',
            wrap: true,
            fontType: 'Default',
            size: 'Large',
            weight: 'Bolder',
            color: 'Good',
            horizontalAlignment: 'Center'
        },
        {
            type: 'ColumnSet',
            separator: true
        }
    ]
};
module.exports.card = card;

module.exports.generateCartCard = function(result) {
    try {
        var newCard = {
            type: 'AdaptiveCard',
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.3',
            body: []
        };
        if (result.length === 0) {
            newCard.body.push({
                type: 'Container',
                items: [
                    {
                        type: 'TextBlock',
                        text: 'Your cart is empty!',
                        wrap: true,
                        spacing: 'Medium',
                        horizontalAlignment: 'Center',
                        size: 'Medium',
                        weight: 'Bolder',
                        color: 'Warning'
                    }
                ]
            });
        } else {
            let amount = 0;
            result.forEach(res => {
                amount += res.productPrice * res.productQuantity;
                newCard.body.push({
                    type: 'ColumnSet',
                    columns: [
                        {
                            type: 'Column',
                            width: 'auto',
                            items: [
                                {
                                    type: 'Image',
                                    url: `${ res.productUrl }`,
                                    spacing: 'None',
                                    separator: true,
                                    horizontalAlignment: 'Center',
                                    size: 'Medium',
                                    width: '70px',
                                    height: '70px'
                                }
                            ]
                        },
                        {
                            type: 'Column',
                            width: 'stretch',
                            items: [
                                {
                                    type: 'Container',
                                    height: 'stretch',
                                    verticalContentAlignment: 'Top',
                                    horizontalAlignment: 'Center',
                                    style: 'good',
                                    items: [
                                        {
                                            type: 'TextBlock',
                                            text: `${ res.productName }`,
                                            wrap: true,
                                            spacing: 'Large',
                                            fontType: 'Default',
                                            size: 'Medium',
                                            weight: 'Bolder',
                                            color: 'Accent',
                                            horizontalAlignment: 'Center'
                                        },
                                        {
                                            type: 'ColumnSet',
                                            columns: [
                                                {
                                                    type: 'Column',
                                                    items: [
                                                        {
                                                            type: 'TextBlock',
                                                            text: `₹ ${ res.productPrice }`,
                                                            wrap: true,
                                                            fontType: 'Default',
                                                            size: 'Default',
                                                            weight: 'Bolder',
                                                            color: 'Default',
                                                            height: 'stretch',
                                                            horizontalAlignment: 'Center'
                                                        }
                                                    ],
                                                    height: 'stretch',
                                                    width: 60
                                                },
                                                {
                                                    type: 'Column',
                                                    width: 40,
                                                    items: [
                                                        {
                                                            type: 'TextBlock',
                                                            text: `x ${ res.productQuantity }`,
                                                            wrap: true,
                                                            fontType: 'Default',
                                                            size: 'Default',
                                                            weight: 'Default',
                                                            color: 'Default',
                                                            height: 'stretch',
                                                            horizontalAlignment: 'Center'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'ActionSet',
                    actions: [
                        {
                            type: 'Action.Submit',
                            title: 'Delete from Cart',
                            style: 'destructive',
                            iconUrl: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/delete-1432400-1211078.png',
                            data: {
                                action: 'del',
                                id: `${ res._id }`
                            }
                        }
                    ]
                });
            });
            newCard.body.push({

                type: 'TextBlock',
                text: `Total Amount : ₹ ${ amount } `,
                spacing: 'Medium',
                horizontalAlignment: 'Center',
                size: 'Medium',
                weight: 'Bolder',
                color: 'Warning',
                wrap: true

            },
            {
                type: 'ActionSet',
                actions: [
                    {
                        spacing: 'Medium',
                        type: 'Action.Submit',
                        title: 'Buy Items',
                        iconUrl: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/shopping-cart-3357656-2806830.png',
                        style: 'positive',
                        data: {
                            action: 'buy',
                            amt: `${ amount }`
                        }
                    }
                ]
            });
        }
        return newCard;
    } catch (error) {
        console.error(error);
        return 'Error!!';
    }
};
