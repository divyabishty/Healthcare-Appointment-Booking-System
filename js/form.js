$(function () {
    function after_form_submitted(success) {
        // Hide the sending text and restore the button text
        $('button[type="button"]').each(function () {
            const $btn = $(this);
            $btn.text($btn.prop('orig_label')); // Restore the original label
        });

        if (success) {
            Toastify({
                text: "Message successfully sent to Admin!",
                duration: 1500,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "green",
                stopOnFocus: true
            }).showToast();

            setTimeout(function () {
                window.location.href = '';
            }, 8000);
        } else {
            Toastify({
                text: "Failed to send message to Admin.",
                duration: 1500,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "red",
                stopOnFocus: true
            }).showToast();
        }
    }

    $('#reused_form').submit(function (e) {
        e.preventDefault();

        const $form = $(this);
        $('button[type="submit"]', $form).each(function () {
            const $btn = $(this);
            $btn.prop('type', 'button');
            $btn.prop('orig_label', $btn.text());  // Save the original button label
            $btn.text('Please Wait ...');  // Change to "Sending ..."
        });

        // Serialize form data
        const formData = $form.serializeArray();
        const messageParts = formData.map((field) => `${field.name}: ${field.value}`);
        const message = messageParts.join('\n');

        // Telegram Bot Token and Chat ID
        const botToken = '7896593630:AAFgsNG0pAd883_7-B3HP3k74LRNVeGEEJQ';
        const chatId = '1827103419';

        // Telegram API URL
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

        // Send data to Telegram
        fetch(telegramApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: `New Form Submission:\n\n${message}`,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.ok) {
                    after_form_submitted(true);
                } else {
                    after_form_submitted(false);
                }
            })
            .catch((error) => {
                console.error('Error sending to Admin:', error);
                after_form_submitted(false);
            });
    });
});
