const router = require('express').Router();
const fetch = require('node-fetch');
const fs = require('fs');
const SampleData = {};
const saveDataToFile = () => {
    fs.writeFileSync('userData.json', JSON.stringify(SampleData, null, 2));
};
router.post('/', async (req, res) => {
    console.log(req.body); // Debugging

    const message = req.body.message;
    const callbackQuery = req.body.callback_query;

    if (message) {
        const chatId = message.chat.id;
        const text = message.text;

        if (text === '/verify') {
            const welcomeText = `*أهلا بك في BalqeesMedia للتحقق من الهوية الخاصة بك،*`;
            const buttons = {
                inline_keyboard: [
                    [
                        { text: 'الأسم الأول', callback_data: 'firstName' },
                        { text: 'الأسم الأخير', callback_data: 'lastName' },
                        { text: 'رقم الهاتف', callback_data: 'phoneNumber' },
                        { text: 'المدينة', callback_data: 'city' }
                    ]
                ]
            };

            try {
                await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: welcomeText,
                        parse_mode: 'MarkdownV2',
                        reply_markup: buttons
                    })
                });
                res.status(200).send('OK');
            } catch (err) {
                res.status(400).send(err);
            }
        } else if (SampleData[chatId] && SampleData[chatId].awaitingField) {
            const field = SampleData[chatId].awaitingField;
            SampleData[chatId][field] = text;
            delete SampleData[chatId].awaitingField;
            saveDataToFile();

            try {
                await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: `Thank you for providing your ${field}.`
                    })
                });
                res.status(200).send('OK');
            } catch (err) {
                console.error('Error sending message:', err);
                res.status(400).send(err);
            }
        }
        // else {
        //     try {
        //         await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({
        //                 chat_id: chatId,
        //                 text: 'Please send /verify to start the verification process.'
        //             })
        //         });
        //         res.status(200).send('OK');
        //     } catch (err) {
        //         res.status(400).send(err);
        //     }
        // }
    } else if (callbackQuery) {
        const chatId = callbackQuery.message.chat.id;
        const callbackData = callbackQuery.data;

        let promptMessage;
        if (callbackData === 'firstName') {
            promptMessage = 'Please send your first name.';
            SampleData[chatId] = { awaitingField: 'firstName' };
        } else if (callbackData === 'lastName') {
            promptMessage = 'Please send your last name.';
            SampleData[chatId] = { awaitingField: 'lastName' };
        } else if (callbackData === 'phoneNumber') {
            promptMessage = 'Please send your phone number.';
            SampleData[chatId] = { awaitingField: 'phoneNumber' };
        } else if (callbackData === 'city') {
            promptMessage = 'Please send your city.';
            SampleData[chatId] = { awaitingField: 'city' };
        }

        try {
            await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: promptMessage
                })
            });

            // Answer callback query to remove loading state
            await fetch(`https://api.telegram.org/bot${process.env.TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    callback_query_id: callbackQuery.id
                })
            });
            res.status(200).send('OK');
        } catch (err) {
            res.status(400).send(err);
        }
    }
});

module.exports = router;