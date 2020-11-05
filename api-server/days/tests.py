from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse
from datetime import date
from .models import Day

UserModel = get_user_model()


class DaysTestCase(TestCase):

    CLIENT = Client()

    @classmethod
    def setUpTestData(cls):
        user = UserModel.objects.create_user(
            username='Smurf',
            email='smurf@bd.fr',
            password='SMURF 1t!',
        )

        Day.objects.create(
            user=user,
            date=date(2020, 11, 5),
            color='#471818',
            notes="when will this mad year end?? I've smurfed enough"
        )

        Day.objects.create(
            user=user,
            date=date(2020, 12, 10),
            color='#1100AA',
        )

        Day.objects.create(
            user=user,
            date=date(2021, 1, 1),
            color='#FFFFFF',
            notes="it's 2021!! Yoohoo! Let's smurf now"
        )

    def setUp(self):
        self.CLIENT.login(username='Smurf', password='SMURF 1t!')

    def test_returns_user_days(self):
        response = self.CLIENT.get(
            reverse(
                'day-list', kwargs={'username': 'Smurf'}) + '?ordering=date'
        )

        self.assertEqual(response.status_code, 200)

        self.assertEqual(response.json(), {
            'count': 3,
            'next': None,
            'previous': None,
            'results': [
                {
                    'color': '#471818',
                    'date': '2020-11-05',
                    'id': 1,
                    'notes': "when will this mad year end?? I've smurfed enough"
                },
                {
                    'color': '#1100AA',
                    'date': '2020-12-10',
                    'id': 2,
                    'notes': ''
                },
                {
                    'color': '#FFFFFF',
                    'date': '2021-01-01',
                    'id': 3,
                    'notes': "it's 2021!! Yoohoo! Let's smurf now"
                }
            ]
        })
