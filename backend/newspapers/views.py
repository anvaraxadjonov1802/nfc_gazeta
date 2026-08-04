from django.db.models import QuerySet
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.request import Request
from rest_framework.response import Response

from accounts.permissions import (
    IsActiveAdmin,
    IsEditorOrSuperAdmin,
    IsSuperAdmin,
)

from .models import Issue, Newspaper
from .serializers import (
    IssueDetailSerializer,
    IssueListSerializer,
    IssuePdfUploadSerializer,
    IssueWriteSerializer,
    NewspaperOptionSerializer,
)


class AdminNewspaperListView(generics.ListAPIView):
    """
    Admin formalarida ishlatiladigan faol gazetalar ro‘yxati.
    """

    permission_classes = [IsActiveAdmin]
    serializer_class = NewspaperOptionSerializer

    def get_queryset(self) -> QuerySet[Newspaper]:
        return Newspaper.objects.filter(
            is_active=True
        ).order_by("name")


class AdminIssueViewSet(viewsets.ModelViewSet):
    """
    Gazeta sonlarini yaratish va boshqarish API'si.
    """

    queryset = (
        Issue.objects.select_related(
            "newspaper",
            "created_by",
            "approved_by",
        )
        .all()
        .order_by(
            "-publication_date",
            "-issue_number",
        )
    )

    http_method_names = [
        "get",
        "post",
        "patch",
        "delete",
        "head",
        "options",
    ]

    def get_permissions(self):
        if self.action in {
            "create",
            "partial_update",
            "upload_pdf",
        }:
            permission_classes = [
                IsEditorOrSuperAdmin,
            ]

        elif self.action == "destroy":
            permission_classes = [
                IsSuperAdmin,
            ]

        else:
            permission_classes = [
                IsActiveAdmin,
            ]

        return [
            permission()
            for permission in permission_classes
        ]

    def get_serializer_class(self):
        if self.action == "list":
            return IssueListSerializer

        if self.action in {
            "create",
            "partial_update",
        }:
            return IssueWriteSerializer

        if self.action == "upload_pdf":
            return IssuePdfUploadSerializer

        return IssueDetailSerializer

    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="upload-pdf",
        parser_classes=[
            MultiPartParser,
            FormParser,
        ],
    )
    def upload_pdf(
        self,
        request: Request,
        pk=None,
    ) -> Response:
        issue = self.get_object()

        if issue.status in {
            Issue.Status.PUBLISHED,
            Issue.Status.ARCHIVED,
        }:
            return Response(
                {
                    "detail": (
                        "Nashr qilingan yoki arxivlangan "
                        "gazetaga yangi PDF yuklab bo‘lmaydi."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = IssuePdfUploadSerializer(
            data=request.data,
        )
        serializer.is_valid(raise_exception=True)

        uploaded_file = serializer.validated_data["file"]

        if issue.original_pdf:
            issue.original_pdf.delete(
                save=False,
            )

        issue.original_pdf = uploaded_file
        issue.page_count = 0
        issue.status = Issue.Status.DRAFT
        issue.is_public = False

        issue.save(
            update_fields=[
                "original_pdf",
                "page_count",
                "status",
                "is_public",
                "updated_at",
            ]
        )

        output_serializer = IssueDetailSerializer(
            issue,
            context={
                "request": request,
            },
        )

        return Response(
            {
                "detail": "PDF muvaffaqiyatli yuklandi.",
                "issue": output_serializer.data,
            },
            status=status.HTTP_200_OK,
        )