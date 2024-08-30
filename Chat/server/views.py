from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Question, Answer
from .serializers import QuestionSerializer, AnswerSerializer
from .openai_model import get_openai_response

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    @action(detail=False, methods=['post'])
    def ask(self, request):
        question_text = request.data.get('text')
        if not question_text:
            return Response({'error': 'Question text is required'}, status=status.HTTP_400_BAD_REQUEST)

        question = Question.objects.create(text=question_text)
        response = get_openai_response(question_text)
        answer = Answer.objects.create(question=question, text=response, is_bot_answer=True)

        serializer = self.get_serializer(question)
        return Response(serializer.data)

class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        answer = self.get_object()
        vote_type = request.data.get('vote_type')

        if vote_type == 'up':
            answer.votes += 1
        elif vote_type == 'down':
            answer.votes -= 1
        else:
            return Response({'error': 'Invalid vote type'}, status=status.HTTP_400_BAD_REQUEST)

        answer.save()
        serializer = self.get_serializer(answer)
        return Response(serializer.data)