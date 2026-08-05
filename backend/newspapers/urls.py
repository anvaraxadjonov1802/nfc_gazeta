from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminIssueViewSet,
    AdminNewspaperListView,
    AdminPageViewSet,
    AdminPageImageViewSet,
)

app_name = "newspapers"

router = DefaultRouter()

router.register(
    "issues",
    AdminIssueViewSet,
    basename="admin-issues",
)

router.register(
    "pages",
    AdminPageViewSet,
    basename="admin-pages",
)

router.register(
    "page-images",
    AdminPageImageViewSet,
    basename="admin-page-images",
)

urlpatterns = [
    path(
        "newspapers/",
        AdminNewspaperListView.as_view(),
        name="admin-newspaper-list",
    ),
    path(
        "",
        include(router.urls),
    ),
]