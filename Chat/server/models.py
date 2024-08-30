from django.db import models
from django.contrib.auth.models import User


class Question(models.Model):
    text = models.TextField()
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="questions", null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Question: {self.text[:50]}..."


class Answer(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers"
    )
    text = models.TextField()
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="answers", null=True, blank=True
    )
    is_bot_answer = models.BooleanField(default=True)
    votes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Answer to: {self.question.text[:30]}... - Votes: {self.votes}"
