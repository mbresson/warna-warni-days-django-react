from django.core.exceptions import ValidationError
from rest_framework.views import exception_handler
from rest_framework.exceptions import Throttled
import re

STRICT_UPPERCASE_SIX_DIGITS_HEXADECIMAL_COLOR_FORMAT = r'^#[A-F0-9]{6}$'


def validate_color(value):
    if re.match(STRICT_UPPERCASE_SIX_DIGITS_HEXADECIMAL_COLOR_FORMAT, value):
        return value
    else:
        raise ValidationError(
            "Color must be in 6-digits, uppercased hexadecimal format (e.g.: '#913BC6')")


def custom_exception_handler(exc, context):
    """
    Returns a customized message for throttled requests. We want to hide the expected time when requests can be resumed.
    """

    response = exception_handler(exc, context)

    if isinstance(exc, Throttled):
        custom_response_data = {
            'detail': 'Too many attempts. Please try again later.'
        }

        response.data = custom_response_data

    return response
