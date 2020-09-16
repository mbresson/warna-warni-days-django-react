
from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Users may not see the list of days of other users.
    """

    def has_permission(self, request, view):
        return request.user.username == view.kwargs['username']
