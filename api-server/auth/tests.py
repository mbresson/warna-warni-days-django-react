from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import Client, TestCase

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

    def test_successfully_creates_user_when_provided_correct_values(self):
        response = self.CLIENT.post(
            reverse('auth-signup'),
            {
                'username': 'VikramSeth',
                'email': 'vikram@seth.com',
                'password': 'Author of A Suitable Boy',
            },
        )

        self.assertEqual(response.status_code, 201)

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
