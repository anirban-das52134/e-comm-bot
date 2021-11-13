var card = {
    type: 'AdaptiveCard',
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    version: '1.3',
    body: [
        {
            type: 'TextBlock',
            text: 'Fill your Details',
            horizontalAlignment: 'Center',
            color: 'Good',
            size: 'Large',
            fontType: 'Default',
            weight: 'Bolder',
            spacing: 'Medium',
            separator: true,
            height: 'stretch'
        },
        {
            type: 'Input.Text',
            id: 'name',
            placeholder: 'Your Name',
            separator: true
        },
        {
            type: 'Input.Text',
            id: 'email',
            placeholder: 'Your Email',
            style: 'Email',
            separator: true
        },
        {
            type: 'Input.Text',
            id: 'mobile',
            placeholder: 'Your Mobile Number',
            separator: true,
            maxLength: 10,
            style: 'Tel'
        },
        {
            type: 'Input.Text',
            id: 'address',
            placeholder: 'Your Address',
            isMultiline: true,
            separator: true
        },
        {
            type: 'Input.Text',
            id: 'post',
            placeholder: 'Your Postal Code',
            separator: true
        },
        {
            type: 'ActionSet',
            actions: [
                {
                    type: 'Action.Submit',
                    style: 'positive',
                    title: 'Checkout'
                }
            ]
        }
    ]
};
module.exports.card = card;
