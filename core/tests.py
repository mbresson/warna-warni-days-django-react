from django.core.exceptions import ValidationError
from django.test import TestCase

from .utils import validate_color


class ValidateColorTestCase(TestCase):
    def test_valid_color_passes_validation(self):
        color = '#913BC6'

        self.assertEqual(validate_color(color), color)

    def test_color_with_lower_case_digits_fails_validation(self):
        color = '#913bC6'

        with self.assertRaises(ValidationError):
            validate_color(color)

    def test_color_with_three_digits_fails_validation(self):
        color = '#FFF'

        with self.assertRaises(ValidationError):
            validate_color(color)

    def test_color_in_rgb_format_fails_validation(self):
        color = 'rgb(255, 0, 42)'

        with self.assertRaises(ValidationError):
            validate_color(color)
