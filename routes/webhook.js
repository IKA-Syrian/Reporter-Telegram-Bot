const router = require('express').Router();
const fetch = require('node-fetch');
const Reporter = require('../schemas/reporter');
const Report = require('../schemas/reports');
const translate = require('google-translate-api-x');
let dataCount = 1;
// http://38.242.243.210:3030/bot7274402293:AAFuoX1x0wgUCmVxgo-I86jw2tP3sDyv97Y/getFile?file_id=BAACAgQAAxkBAAIBO2Z8JpFrphCYXbKGeooZInVOOQjrAAIrHwAC8kThU12VXwWLs4hENQQ
// http://38.242.243.210:3030/file/bot7274402293:AAFuoX1x0wgUCmVxgo-I86jw2tP3sDyv97Y/videos/file_0.mp4
let SampleData = [];

router.post('/', async (req, res) => {
    console.log(req.body); // Debugging

    const message = req.body.message;
    const callbackQuery = req.body.callback_query;

    if (message) {
        const chatId = message.chat.id;
        const text = message.text;

        try {
            let user = await Reporter.findOne({ TelegramId: message.from.id });
            if (!user) {
                user = new Reporter({ TelegramId: message.from.id });
                await user.save();
            }
            if (user.isBlocked) {
                await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: 'You have been blocked from using this bot due to repeated invalid commands.'
                    })
                });
                return res.status(200).send('OK');
            }

            if (text === '/verify') {
                global.buttons = {
                    inline_keyboard: [
                        [
                            { text: 'الأسم الأول', callback_data: 'firstName' },
                            { text: 'الأسم الأخير', callback_data: 'lastName' },
                            { text: 'رقم الهاتف', callback_data: 'phoneNumber' },
                            { text: 'المدينة', callback_data: 'city' }
                        ]
                    ]
                };

                if (user.Verified) {
                    await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: 'انت مفعل بالفعل.'
                        })
                    });
                    return res.status(200).send('OK');

                } else if (user.Verified === false && user.firstName && user.lastName && user.phoneNumber && user.city) {
                    await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: 'شكراً لك على تقديم معلوماتك، سيتم التحقق منها والتواصل معك في أقرب وقت ممكن، أو يمكنك التواصل مع الشخص المسؤول عن ذلك.'
                        })
                    });
                    return res.status(200).send('OK');
                } else {
                    const welcomeText = `*أهلا بك في BalqeesMedia للتحقق من الهوية الخاصة بك،*`;
                    await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: welcomeText,
                            parse_mode: 'MarkdownV2',
                            reply_markup: global.buttons
                        })
                    });
                    return res.status(200).send('OK');
                }
            } else if (text === '/newreport') {
                global.reportButtons = {
                    inline_keyboard: [
                        [
                            { text: 'عنوان التقرير', callback_data: 'reportTitle' },
                            { text: 'التقرير', callback_data: 'reportContent' },
                            { text: 'عدد المرفقات', callback_data: 'reportNumberOfAttachments' },
                            { text: 'المرفقات', callback_data: 'reportAttachments' },
                            { text: 'موقع الواقعة', callback_data: 'reportLocation' }
                        ]
                    ]
                }
                if (user.Verified && user.Verified === true) {
                    await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: 'يرجى إرسال تقريرك.',
                            reply_markup: global.reportButtons
                        })
                    });
                    return res.status(200).send('OK');
                } else {
                    await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            text: 'يرجى تفعيل حسابك اولا.'
                        })
                    });
                    return res.status(200).send('OK');
                }
            } else {
                console.log(`:::::::::::::::::::::::::::::::::::::::Data ${dataCount}:::::::::::::::::::::::::::::::::::::::::`)
                dataCount++;
                const currentData = SampleData.find(chat => chat.chatId === message.from.id && chat.awaitingField);
                const fileData = message.document || message.video || message.voice || message.audio || message.animation || message.video_note || message.sticker || (message.photo ? message.photo[3] ? message.photo[3] : message.photo[4] : null);
                const mime_type = message.document ? message.document.mime_type : message.video ? message.video.mime_type : message.voice ? message.voice.mime_type : message.audio ? message.audio.mime_type : message.animation ? message.animation.mime_type : message.video_note ? message.video_note.mime_type : message.sticker ? message.sticker.mime_type : (message.photo ? "image/jpeg" : null);
                if (currentData && currentData.Data === "verification") {
                    const field = currentData.awaitingField;
                    if (field === "phoneNumber") {
                        currentData[field] = message.contact ? message.contact.phone_number : text;
                    } else {
                        currentData[field] = text;
                    }

                    global.buttons = {
                        inline_keyboard: [
                            global.buttons.inline_keyboard[0].filter(Feild => Feild.callback_data !== field)
                        ]
                    };

                    const updatedUser = await Reporter.findOneAndUpdate(
                        { TelegramId: message.from.id },
                        { [field]: currentData[field] },
                        { new: true }
                    );

                    await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/editMessageReplyMarkup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            message_id: currentData['mainMessageID'],
                            reply_markup: global.buttons
                        })
                    });


                    delete currentData.awaitingField;
                    if (updatedUser.firstName && updatedUser.lastName && updatedUser.phoneNumber && updatedUser.city && updatedUser.Verified == false) {

                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: `شكرا لك على ارسال ${await translate(field, { to: 'ar' }).then((res) => res.text)}.`
                            })
                        });
                        const confirmationText = `
                        هل تؤكد ان هذه هي معلوماتك قبل حفظها لدينا؟
الأسم الأول: ${updatedUser.firstName}
الأسم الأخير: ${updatedUser.lastName}
رقم الهاتف: +${updatedUser.phoneNumber}
المدينة: ${updatedUser.city}
                        `;
                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: confirmationText,
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: 'نعم', callback_data: 'confirm_yes' },
                                            { text: 'لا', callback_data: 'confirm_no' }
                                        ]
                                    ]
                                }
                            })
                        });
                        // Mark the current data entry as completed
                        SampleData = [...SampleData.filter(chat => chat.chatId !== message.from.id)]
                        return res.status(200).send('OK');
                    } else {
                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: `شكرا لك على ارسال ${await translate(field, { to: 'ar' }).then((res) => res.text)}.`
                            })
                        });
                        return res.status(200).send('OK');
                    }
                } else if (currentData && currentData.Data === "report") {
                    const field = currentData.awaitingField;
                    const prvData = await Report.findOne({ TelegramId: message.from.id, reportID: currentData['mainMessageID'] });

                    if (field === "reportNumberOfAttachments") {
                        currentData[field] = text;
                        for (let i = 1; i < parseInt(text); i++) {
                            SampleData.push({ chatId, awaitingField: 'reportAttachments', mainMessageID: currentData['mainMessageID'], Data: "report", ColumnName: "reportAttachments" });
                        }
                        global.reportButtons = {
                            inline_keyboard: [
                                global.reportButtons.inline_keyboard[0].filter(Feild => Feild.callback_data !== field)
                            ]
                        };
                        delete currentData.awaitingField;
                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/editMessageReplyMarkup`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                message_id: currentData['mainMessageID'],
                                reply_markup: global.reportButtons
                            })
                        });

                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: `شكرا لك على ارسال ${await translate(field, { to: 'ar' }).then((res) => res.text)}.`
                            })
                        });
                        return res.status(200).send('OK');
                    } else if (field === "reportAttachments") {
                        console.log(message.photo);
                        const FileData = await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/getFile?file_id=${fileData.file_id}`).then(res => res.json());
                        const filePath = FileData.result.file_path;
                        console.log(SampleData.filter(chat => chat.chatId === message.from.id && chat.awaitingField === "reportAttachments").length)
                        if (SampleData.filter(chat => chat.chatId === message.from.id && chat.awaitingField === "reportAttachments").length > 1) {
                            delete currentData.awaitingField;
                            await Report.findOneAndUpdate({ TelegramId: message.from.id, reportID: currentData['mainMessageID'] }, { [currentData.ColumnName]: [...prvData.reportAttachments, { reportID: currentData['mainMessageID'], file_unique_id: fileData.file_unique_id, filePath, mime_type, downloadCount: 0 }] }, { new: true });
                            return res.status(200).send('OK');
                        } else {
                            delete currentData.awaitingField;
                            await Report.findOneAndUpdate({ TelegramId: message.from.id, reportID: currentData['mainMessageID'] }, { [currentData.ColumnName]: [...prvData.reportAttachments, { reportID: currentData['mainMessageID'], file_unique_id: fileData.file_unique_id, filePath, mime_type, downloadCount: 0 }] }, { new: true });

                            global.reportButtons = {
                                inline_keyboard: [
                                    global.reportButtons.inline_keyboard[0].filter(Feild => Feild.callback_data !== field)
                                ]
                            };

                            await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/editMessageReplyMarkup`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    chat_id: chatId,
                                    message_id: currentData['mainMessageID'],
                                    reply_markup: global.reportButtons
                                })
                            });

                            await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    chat_id: chatId,
                                    text: `شكرا لك على ارسال ${await translate(field, { to: 'ar' }).then((res) => res.text)}.`
                                })
                            });
                            SampleData.pop();

                            return res.status(200).send('OK');
                        }
                        // Append the new file path to the attachments array
                    } else {
                        currentData[field] = text;
                        delete currentData.awaitingField;
                    }

                    global.reportButtons = {
                        inline_keyboard: [
                            global.reportButtons.inline_keyboard[0].filter(Feild => Feild.callback_data !== field)
                        ]
                    };

                    const updatedReport = await Report.findOneAndUpdate({ TelegramId: message.from.id, reportID: currentData['mainMessageID'] }, { [currentData.ColumnName]: currentData[field] }, { new: true });

                    delete currentData.awaitingField;
                    await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/editMessageReplyMarkup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chatId,
                            message_id: currentData['mainMessageID'],
                            reply_markup: global.reportButtons
                        })
                    });
                    if (updatedReport && updatedReport.reportAttachments.length > 0 && updatedReport.reportTitle && updatedReport.reportDescription && updatedReport.reportLocation) {
                        let reportConfermationText = `
                        هل تؤكد ان هذا هو التقرير الذي تريد ارساله؟
عنوان التقرير: ${updatedReport.reportTitle}
التقرير: ${updatedReport.reportDescription}
عدد المرفقات: ${updatedReport.reportNumberOfAttachments}
موقع الواقعة: ${updatedReport.reportLocation}
                        `;
                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: reportConfermationText,
                                parse_mode: 'HTML',
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: 'نعم', callback_data: 'report_Confirm_yes' },
                                            { text: 'لا', callback_data: `report_Confirm_no_${updatedReport.reportID}` }
                                        ]
                                    ]
                                },
                            })
                        });
                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: `شكراً لك على إرسال التقرير الخاص بك، لاي استفسارات او مشاكل يرجى حفظ رقم التقرير الخاص بك: ${updatedReport.reportID}`
                            })
                        });
                        SampleData = [...SampleData.filter(chat => chat.chatId !== message.from.id)]
                        res.status(200).send('OK');
                    } else {
                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: `شكرا لك على ارسال ${await translate(field, { to: 'ar' }).then((res) => res.text)}.`
                            })
                        });
                        res.status(200).send('OK');
                    }

                } else {
                    user.invalidAttempts += 1;
                    await user.save();

                    if (user.invalidAttempts >= 4) {
                        user.isBlocked = true;
                        await user.save();

                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: 'You have been blocked from using this bot due to repeated invalid commands.'
                            })
                        });
                        return res.status(200).send('OK');
                    } else {
                        await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                chat_id: chatId,
                                text: 'يرجى إرسال رسالة صحيحة.'
                            })
                        });
                        return res.status(200).send('OK');
                    }
                }
            }
            // res.status(200).send('OK');
        } catch (err) {
            console.error(err);
            return res.status(500).send(err);
        }
    } else if (callbackQuery) {
        const chatId = callbackQuery.message.chat.id;
        const callbackData = callbackQuery.data;

        let promptMessage;
        if (callbackData === 'firstName') {
            promptMessage = 'يرجى إرسال الاسم الأول.';
            SampleData.push({ chatId, awaitingField: 'firstName', mainMessageID: callbackQuery.message.message_id, Data: "verification" });
        } else if (callbackData === 'lastName') {
            promptMessage = 'يرجى إرسال الاسم الأخير.';
            SampleData.push({ chatId, awaitingField: 'lastName', mainMessageID: callbackQuery.message.message_id, Data: "verification" });
        } else if (callbackData === 'phoneNumber') {
            promptMessage = 'يرجى إرسال رقم الهاتف.';
            SampleData.push({ chatId, awaitingField: 'phoneNumber', mainMessageID: callbackQuery.message.message_id, Data: "verification" });
        } else if (callbackData === 'city') {
            promptMessage = 'يرجى إرسال اسم المدينة التي تحدثنا منها.';
            SampleData.push({ chatId, awaitingField: 'city', mainMessageID: callbackQuery.message.message_id, Data: "verification" });
        } else if (callbackData === 'confirm_yes') {
            promptMessage = 'شكراً لك على تقديم معلوماتك، سيتم التحقق منها والتواصل معك في أقرب وقت ممكن، أو يمكنك التواصل مع الشخص المسؤول عن ذلك.';
            await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/editMessageReplyMarkup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: callbackQuery.message.message_id,
                    reply_markup: {}
                })
            });
        } else if (callbackData === 'confirm_no') {
            await Reporter.findOneAndDelete({ TelegramId: chatId });
            await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/editMessageReplyMarkup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: callbackQuery.message.message_id,
                    reply_markup: {}
                })
            });
            promptMessage = 'يرجى إعادة إدخال معلوماتك من جديد.';
        } else if (callbackData === 'reportTitle') {
            try {
                await Report.findOne({ TelegramId: chatId, reportID: callbackQuery.message.message_id }) || await new Report({ TelegramId: chatId, reportID: callbackQuery.message.message_id }).save();
                promptMessage = 'يرجى إرسال عنوان التقرير.';
                SampleData.push({ chatId, awaitingField: 'reportTitle', mainMessageID: callbackQuery.message.message_id, Data: "report", ColumnName: "reportTitle" });
            } catch (err) {
                console.log(err);
            }
        } else if (callbackData === 'reportContent') {
            promptMessage = 'يرجى إرسال التقرير.';
            SampleData.push({ chatId, awaitingField: 'reportContent', mainMessageID: callbackQuery.message.message_id, Data: "report", ColumnName: "reportDescription" });
        } else if (callbackData === 'reportNumberOfAttachments') {
            promptMessage = 'يرجى إرسال عدد المرفقات فقط.';
            SampleData.push({ chatId, awaitingField: 'reportNumberOfAttachments', mainMessageID: callbackQuery.message.message_id, Data: "report", ColumnName: "reportNumberOfAttachments" });
        } else if (callbackData === 'reportAttachments') {
            promptMessage = 'يرجى إرسال المرفقات.';
            SampleData.push({ chatId, awaitingField: 'reportAttachments', mainMessageID: callbackQuery.message.message_id, Data: "report", ColumnName: "reportAttachments" });
        } else if (callbackData === 'reportLocation') {
            promptMessage = 'يرجى إرسال موقع الواقعة.';
            SampleData.push({ chatId, awaitingField: 'reportLocation', mainMessageID: callbackQuery.message.message_id, Data: "report", ColumnName: "reportLocation" });
        } else if (callbackData === 'reportExtraLinks') {
            promptMessage = 'يرجى إرسال الروابط الإضافية في رسالة واحدة.';
            SampleData.push({ chatId, awaitingField: 'reportExtraLinks', mainMessageID: callbackQuery.message.message_id, Data: "report", ColumnName: "reportExtraLinks" });
        } else if (callbackData === 'report_Confirm_yes') {
            try {
                promptMessage = 'شكراً لك على تقديم التقرير، سيتم التحقق منه والتواصل معك في أقرب وقت ممكن.';
                await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/editMessageReplyMarkup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        message_id: callbackQuery.message.message_id,
                        reply_markup: {}

                    })
                });
            } catch (err) {
                console.log(err);
            }
        } else if (callbackData === `report_Confirm_no_${callbackData.split('_')[3]}`) {
            await Report.findOneAndDelete({ TelegramId: chatId, reportID: callbackData.split('_')[3] });
            promptMessage = 'يرجى إعادة إدخال التقرير من جديد.';
            await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/editMessageReplyMarkup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: callbackQuery.message.message_id,
                    reply_markup: {}

                })
            });
        }
        try {
            await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: promptMessage
                })
            });

            // Answer callback query to remove loading state
            await fetch(`http://38.242.243.210:3030/bot${process.env.TOKEN}/answerCallbackQuery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    callback_query_id: callbackQuery.id
                })
            });
            return res.status(200).send('OK');
        } catch (err) {
            return res.status(500).send(err);
        }
    }
});

module.exports = router;
