var card = {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.3',
    body: [
        {
            type: 'TextBlock',
            text: 'Shopping Catalog',
            wrap: true,
            fontType: 'Default',
            size: 'Large',
            weight: 'Bolder',
            color: 'Good',
            horizontalAlignment: 'Center'
        }
    ]
};
module.exports.card = card;

module.exports.generateCatalogCard = function(result) {
    try {
        var newCard = {
            type: 'AdaptiveCard',
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.3',
            body: []
        };
        result.forEach(res => {
            newCard.body.push({
                type: 'Container',
                spacing: 'Medium',
                horizontalAlignment: 'Center',
                items: [
                    {
                        type: 'ColumnSet',
                        columns: [
                            {
                                type: 'Column',
                                width: 'stretch',
                                items: [
                                    {
                                        type: 'Image',
                                        spacing: 'Medium',
                                        separator: true,
                                        horizontalAlignment: 'Center',
                                        url: `${ res.productUrl }`,
                                        width: '100px',
                                        height: '120px',
                                        size: 'Medium'
                                    }
                                ]
                            },
                            {
                                type: 'Column',
                                width: 'stretch',
                                items: [
                                    {
                                        type: 'TextBlock',
                                        text: `${ res.productName }`,
                                        wrap: true,
                                        height: 'stretch',
                                        maxLines: 1,
                                        fontType: 'Default',
                                        size: 'Large',
                                        weight: 'Bolder',
                                        color: 'Accent',
                                        horizontalAlignment: 'Center'
                                    },
                                    {
                                        type: 'TextBlock',
                                        text: `${ res.productDesc }`,
                                        wrap: true,
                                        horizontalAlignment: 'Center',
                                        height: 'stretch',
                                        maxLines: 3,
                                        fontType: 'Default',
                                        size: 'Default',
                                        weight: 'Bolder',
                                        color: 'Dark'
                                    },
                                    {
                                        type: 'TextBlock',
                                        wrap: true,
                                        text: `₹ ${ res.productPrice }`,
                                        spacing: 'Medium',
                                        separator: true,
                                        height: 'stretch',
                                        maxLines: 1,
                                        fontType: 'Default',
                                        size: 'Medium',
                                        weight: 'Bolder',
                                        color: 'Good',
                                        isSubtle: false,
                                        horizontalAlignment: 'Center'
                                    }
                                ]
                            }
                        ],
                        style: 'emphasis',
                        bleed: true
                    },
                    {
                        type: 'Input.Number',
                        id: `${ res._id }`,
                        placeholder: 'Quantity',
                        separator: true,
                        min: 1,
                        max: 20,
                        value: 1,
                        spacing: 'Medium'
                    },
                    {
                        type: 'ActionSet',
                        actions: [
                            {
                                type: 'Action.Submit',
                                title: 'Add to Cart',
                                data: {
                                    id: `${ res._id }`
                                },
                                style: 'positive',
                                iconUrl: 'https://cdn.iconscout.com/icon/premium/png-256-thumb/shopping-cart-3357656-2806830.png'
                            }
                        ],
                        separator: true,
                        horizontalAlignment: 'Center'
                    }
                ]
            });
        });
        return newCard;
    } catch (error) {
        console.error(error);
        return 'Error!!';
    }
};
