from django.urls import path
from . import views  # The dot means "import from the same folder as this file"

urlpatterns = [
    path('transactions/', views.TransactionListCreateView.as_view()),
    path('transactions/<uuid:id>/', views.TransactionRetrieveUpdateDestroyView.as_view())
    
]