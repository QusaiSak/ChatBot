from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.OPEN_API_KEY)


class ChatbotView(APIView):
    def post(self, request):
        user_input = request.data.get('message', '')
        
        # Configure the model
        model = genai.GenerativeModel('gemini-pro')
        
        # Prepare the prompt
        prompt = f"""You are an AI agricultural assistant. Provide helpful information and advice about farming, crop selection, and agricultural practices. 
        User query: {user_input}
        Response:"""
        
        # Generate content
        response = model.generate_content(prompt)
        
        return Response({'response': response.text}, status=status.HTTP_200_OK)
