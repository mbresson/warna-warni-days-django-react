from django.contrib.auth import get_user_model
from django.core import mail
from django.urls import reverse
from django.test import Client, TestCase
import re
from .models import UserProfile

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


class LogoutTestCase(TestCase):

    CLIENT = Client()

    @classmethod
    def setUpTestData(cls):
        UserModel.objects.create_user(
            username='Greta',
            email='greta@thunberg.com',
            password='I care for the climate',
        )

    def setUp(self):
        self.CLIENT.login(username='Greta', password='I care for the climate')

    def test_returns_200_and_clears_session_if_logged_out_successfully(self):
        response = self.CLIENT.post(reverse('auth-logout'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.cookies['sessionid'].value, '')


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

        new_user_profile = UserProfile.objects.get(user__username='VikramSeth')

        self.assertEqual(new_user_profile.preferred_first_weekday,
                         UserProfile.FirstWeekday.SUNDAY)

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

    def test_cannot_create_user_if_password_is_too_weak(self):
        response = self.CLIENT.post(
            reverse('auth-signup'),
            {
                'username': 'licorn',
                'email': 'licorn@oz.com',
                'password': 'j',
            },
        )

        self.assertEqual(response.status_code, 400)

        self.assertEqual(
            response.json(), {
                'password': [
                    'This password is too short. It must contain at least 8 characters.',
                    'This password is too common.'
                ],
            }
        )


class AccountTestCase(TestCase):

    CLIENT = Client()

    @classmethod
    def setUpTestData(cls):
        user = UserModel.objects.create_user(
            username='Toto',
            email='toto@outlook.com',
            password='my password',
        )

        UserProfile.objects.create(
            user=user,
            preferred_first_weekday=UserProfile.FirstWeekday.SUNDAY,
        )

    def setUp(self):
        self.CLIENT.login(username='Toto', password='my password')

    def test_gets_the_user_information(self):
        response = self.CLIENT.get(reverse('auth-account'))

        self.assertEqual(response.status_code, 200)

        profile = response.json()

        self.assertIn('date_joined', profile)

        profile.pop('date_joined')

        self.assertEqual(
            profile,
            {
                'username': 'Toto',
                'email': 'toto@outlook.com',
                'preferred_first_weekday': 'S',
            }
        )

    def test_can_change_preferred_first_weekday_without_password_check(self):
        response = self.CLIENT.patch(
            reverse('auth-account'),
            {
                'preferred_first_weekday': 'M',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)

        user_profile = UserProfile.objects.get(user__username='Toto')

        self.assertEqual(user_profile.preferred_first_weekday, 'M')

    def test_rejects_incorrect_preferred_first_weekday(self):
        response = self.CLIENT.patch(
            reverse('auth-account'),
            {
                'preferred_first_weekday': 'some day',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 400)

        self.assertEqual(response.json(), {
            'preferred_first_weekday': ['"some day" is not a valid choice.']
        })

    def test_changing_password_requires_current_password_confirmation(self):
        response = self.CLIENT.patch(
            reverse('auth-account'),
            {
                'password': 'my NEW password',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json(), {
            'current_password': 'Incorrect password'
        })

    def test_changing_password_works_if_current_password_provided(self):
        response = self.CLIENT.patch(
            reverse('auth-account'),
            {
                'current_password': 'my password',
                'password': 'my NEW password',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)

        user = UserModel.objects.get(username='Toto')

        self.assertTrue(user.check_password('my NEW password'))

    def test_changing_email_requires_current_password_confirmation(self):
        response = self.CLIENT.patch(
            reverse('auth-account'),
            {
                'email': 'some@email.com',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json(), {
            'current_password': 'Incorrect password'
        })

    def test_returns_400_if_current_password_provided_is_wrong(self):
        response = self.CLIENT.patch(
            reverse('auth-account'),
            {
                'current_password': 'this is wrong',
                'password': 'my NEW password',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.json(), {
            'current_password': 'Incorrect password'
        })

    def test_returns_400_if_new_password_does_not_satisfy_basic_requirements(self):
        response = self.CLIENT.patch(
            reverse('auth-account'),
            {
                'current_password': 'my password',
                'password': 'j',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 400)

        self.assertEqual(response.json(), {
            'password': [
                'This password is too short. It must contain at least 8 characters.',
                'This password is too common.'
            ]
        })

    def test_account_is_successfully_deleted_if_current_password_is_provided(self):
        response = self.CLIENT.delete(
            reverse('auth-account'),
            {
                'current_password': 'my password',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 204)

        self.assertFalse(
            UserModel.objects.filter(username='Toto').exists()
        )

    def test_account_is_not_deleted_if_password_is_wrong(self):
        response = self.CLIENT.delete(
            reverse('auth-account'),
            {
                'current_password': 'oups',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 403)

        self.assertEqual(response.json(), {
            'current_password': 'Incorrect password'
        })


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
