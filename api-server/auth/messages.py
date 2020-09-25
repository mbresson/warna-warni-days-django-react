
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_password_reset_message(username, user_email, new_password):
    subject = 'Your password has been reset on Warna-Warni-Days'

    html_message = render_to_string(
        'password_reset_email_template.html',
        {
            'username': username,
            'password': new_password,
        },
    )

    plain_message = strip_tags(html_message)
    from_email = "From <{}>".format(settings.EMAIL_SENDER_ADDRESS)

    send_mail(
        subject,
        plain_message,
        from_email,
        [user_email],
        html_message=html_message,
    )
