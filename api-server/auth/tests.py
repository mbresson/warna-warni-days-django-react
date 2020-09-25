from django.contrib.auth import get_user_model
from django.core import mail
from django.urls import reverse
from django.test import Client, TestCase
import re

UserModel = get_user_model()


class LoginTestCase(TestCase):

    CLIENT = Client()

    def test_returns_200_with_session_cookie_if_logged_in_successfully(self):
        user = UserModel.objects.create_user(
            username='Harry Potter',
            email='harry.potter@gryffindor.com',
            password='Alohomora!',
        )

        response = self.CLIENT.post(
            reverse('auth-login'),
            {
                'username': 'Harry Potter',
                'password': 'Alohomora!',
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('sessionid', response.cookies)

    def test_returns_403_if_wrong_credentials(self):
        response = self.CLIENT.post(
            reverse('auth-login'),
            {
                'username': 'Drago Malfoy',
                'password': 'Alohumorous!',
            },
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {
                'detail': 'Incorrect authentication credentials.',
            },
        )


class SignupTestCase(TestCase):

    CLIENT = Client()

    def test_creates_new_account_and_automatically_logs_new_user_in(self):
        response = self.CLIENT.post(
            reverse('auth-signup'),
            {
                'username': 'VikramSeth',
                'email': 'vikram@seth.com',
                'password': 'Author of A Suitable Boy',
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertIn('sessionid', response.cookies)

        self.assertTrue(
            UserModel.objects.filter(username='VikramSeth').exists()
        )

    def test_cannot_create_user_with_existing_username_or_email(self):
        UserModel.objects.create_user(
            'IAlreadyExist', 'ialready@exist.com', 'do_not_reuse_my_identity!'
        )

        response = self.CLIENT.post(
            reverse('auth-signup'),
            {
                'username': 'coucou',
                'email': 'ialready@exist.com',
                'password': 'some password',
            },
        )

        self.assertEqual(response.status_code, 400)

        self.assertEqual(
            response.json(), {
                'email': ['A user with that email already exists.'],
            }
        )


class ResetPasswordTestCase(TestCase):

    CLIENT = Client()

    @classmethod
    def setUpTestData(cls):
        UserModel.objects.create_user(
            username='Someone-s-Great-Grandfather',
            email='email_set_up_by_my_grandchild@wanadoo.com',
            password='OoopsIAlreadyForgotThis!',
        )

    def emails_sent(self):
        return len(mail.outbox)

    def test_resets_password_and_sends_email(self):
        response = self.CLIENT.post(
            reverse('auth-reset-password'),
            {
                'username': 'Someone-s-Great-Grandfather',
                'email': 'email_set_up_by_my_grandchild@wanadoo.com',
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.emails_sent(), 1)

        sent_message = mail.outbox[0].body

        new_password = re.search(
            r'New password: (.*)\n', sent_message).group(1)

        user = UserModel.objects.get(username='Someone-s-Great-Grandfather')

        self.assertTrue(user.check_password(new_password))

    def test_returns_200_and_does_nothing_if_username_matches_but_email_is_wrong(self):
        response = self.CLIENT.post(
            reverse('auth-reset-password'),
            {
                'username': 'Someone-s-Great-Grandfather',
                'email': 'not-the-right@email.com',
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.emails_sent(), 0)

        user = UserModel.objects.get(username='Someone-s-Great-Grandfather')

        # check that password is unchanged
        self.assertTrue(user.check_password('OoopsIAlreadyForgotThis!'))

    def test_returns_200_and_does_nothing_when_no_account_found(self):
        response = self.CLIENT.post(
            reverse('auth-reset-password'),
            {
                'username': 'IDoNotExist',
                'email': 'ghost@email.com',
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.emails_sent(), 0)
