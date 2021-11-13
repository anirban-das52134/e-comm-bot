// Static Strings
const CONSTANT = require('../utils/constant');
module.exports.generateCard = function(id, change, afterAdd) {
    try {
        var card = {
            type: 'AdaptiveCard',
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.3',
            body: [
                {
                    type: 'Container',
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
                                            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/OOjs_UI_icon_alert-yellow.svg/1024px-OOjs_UI_icon_alert-yellow.svg.png',
                                            horizontalAlignment: 'Right',
                                            size: 'Small',
                                            width: '30px'
                                        }
                                    ]
                                },
                                {
                                    type: 'Column',
                                    width: 'stretch',
                                    items: [
                                        {
                                            type: 'TextBlock',
                                            text: 'ALERT!',
                                            wrap: true,
                                            height: 'stretch',
                                            horizontalAlignment: 'Left',
                                            fontType: 'Default',
                                            size: 'Large',
                                            weight: 'Bolder',
                                            color: 'Warning',
                                            spacing: 'Medium'
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'TextBlock',
                            text: `${ CONSTANT.AlertProductExist }`,
                            wrap: true,
                            fontType: 'Default',
                            weight: 'Bolder',
                            size: 'Medium',
                            color: 'Warning',
                            height: 'stretch',
                            isSubtle: false,
                            horizontalAlignment: 'Center'
                        },
                        {
                            type: 'TextBlock',
                            text: 'Choose an option from below',
                            wrap: true,
                            fontType: 'Default',
                            weight: 'Bolder',
                            size: 'Default',
                            color: 'Good',
                            height: 'stretch',
                            isSubtle: false,
                            horizontalAlignment: 'Center'
                        }
                    ]
                },
                {
                    type: 'Container',
                    items: [
                        {
                            type: 'ActionSet',
                            actions: [
                                {
                                    type: 'Action.Submit',
                                    title: 'Increase Quantity',
                                    id: 'increase',
                                    style: 'positive',
                                    data: {
                                        action: 'in',
                                        id: id,
                                        quantity: afterAdd
                                    }
                                },
                                {
                                    type: 'Action.Submit',
                                    title: 'Change Quantity',
                                    id: 'change',
                                    style: 'destructive',
                                    data: {
                                        action: 'ch',
                                        id: id,
                                        quantity: change
                                    }
                                },
                                {
                                    type: 'Action.Submit',
                                    title: 'Cancel',
                                    id: 'cancel',
                                    data: {
                                        action: 'ca'
                                    }
                                }
                            ],
                            height: 'stretch',
                            separator: true,
                            spacing: 'Medium'
                        }
                    ],
                    horizontalAlignment: 'Center',
                    style: 'warning'
                }
            ]
        };
        return card;
    } catch (error) {
        console.error(error);
        return 'Error!!';
    }
};
