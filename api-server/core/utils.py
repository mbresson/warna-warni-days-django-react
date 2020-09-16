from django.core.exceptions import ValidationError
import re

STRICT_UPPERCASE_SIX_DIGITS_HEXADECIMAL_COLOR_FORMAT = r'^#[A-F0-9]{6}$'


def validate_color(value):
    if re.match(STRICT_UPPERCASE_SIX_DIGITS_HEXADECIMAL_COLOR_FORMAT, value):
        return value
    else:
        raise ValidationError(
            "Color must be in 6-digits, uppercased hexadecimal format (e.g.: '#913BC6')")
