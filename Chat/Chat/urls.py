from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.documentation import include_docs_urls
from server.views import QuestionViewSet, AnswerViewSet

router = DefaultRouter()
router.register(r"questions", QuestionViewSet)
router.register(r"answers", AnswerViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path(
        "api/token/", obtain_auth_token, name="api_token_auth"
    ),  # For token authentication
    path(
        "api/docs/", include_docs_urls(title="Agriculture Chatbot API")
    ),  # API documentation
]

# Add this if you want to serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
