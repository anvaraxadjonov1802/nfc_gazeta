from rest_framework.permissions import BasePermission

from .models import User


class IsActiveAdmin(BasePermission):
    """
    Faqat faol va admin panelga kirish huquqi mavjud
    administratorlarga ruxsat beradi.
    """

    message = "Admin paneldan foydalanish uchun ruxsat yo‘q."

    allowed_roles = {
        User.Role.SUPER_ADMIN,
        User.Role.EDITOR,
        User.Role.REVIEWER,
    }

    def has_permission(self, request, view) -> bool:
        user = request.user

        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and user.is_staff
            and user.role in self.allowed_roles
        )