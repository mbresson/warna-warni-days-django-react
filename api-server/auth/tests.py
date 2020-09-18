from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import Client, TestCase

UserModel = get_user_model()


class LoginTestCase(TestCase):
    USERNAME = 'Harry Potter'
    PASSWORD = 'Alohomora!'

    @classmethod
    def setUpTestData(cls):
        user = UserModel.objects.create_user(
            username=cls.USERNAME,
            email='harry.potter@gryffindor.com',
            password=cls.PASSWORD,
        )

        cls.client = Client()

    def test_returns_200_with_session_cookie_if_logged_in_successfully(self):
        response = self.client.post(
            reverse('auth-login'),
            {
                'username': self.USERNAME,
                'password': self.PASSWORD
            }
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('sessionid', response.cookies)

    def test_returns_403_if_wrong_credentials(self):
        response = self.client.post(
            reverse('auth-login'),
            {
                'username': 'Drago Malfoy',
                'password': 'Alohumorous!'
            }
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {
                'detail': 'Incorrect authentication credentials.'
            }
        )
