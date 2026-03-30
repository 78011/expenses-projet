from .models import Transaction
from rest_framework import serializers

class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = ['id', 'text', 'amount', 'created_at']
        read_only_fields = ['id', 'created_at']