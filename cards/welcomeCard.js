const optionList = require('../utils/startMenuOptions').startOptionsList;
module.exports.generateWelcomeCard = function() {
    try {
        var card = {
            type: 'AdaptiveCard',
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.3',
            body: [
                {
                    type: 'TextBlock',
                    text: 'Menu',
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

        for (let i = 0; i < optionList.length; i++) {
            card.body.push({
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
                                        type: 'ActionSet',
                                        actions: [
                                            {
                                                type: 'Action.Submit',
                                                title: `${ optionList[i].optionName }`,
                                                data: `${ optionList[i].optionName }`
                                            }
                                        ]
                                    }
                                ],
                                verticalContentAlignment: 'Center'
                            }
                        ]
                    }
                ]
            });
        };
        return card;
    } catch (error) {
        console.error(error);
        return 'Error!!';
    }
};
