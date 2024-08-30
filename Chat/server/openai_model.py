from django.conf import settings

import google.generativeai as genai
# Create your views here.
genai.configure(api_key=settings.OPEN_API_KEY)
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
}


def get_openai_response(question):
    try:
        model = genai.GenerativeModel(
            "gemini-1.5-flash",
            generation_config=generation_config,
        )
        chat = model.start_chat(history=[])
        response = chat.send_message(question)
        return response.text
    except Exception as e:
        print(f"Error in Gemini API call: {e}")
        return "I'm sorry, I couldn't process your question at the moment. Please try again later."
