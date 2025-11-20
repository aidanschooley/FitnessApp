import os
from openai import OpenAI

def chatbot_conversation():
    print("Hello!")

    api_key = os.environ.get("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set!")

    client = OpenAI(
        api_key=api_key,
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )

    system_message = {
        "role": "system",
        "content": "You are an athletic activity analyst that helps users summarize their daily activities and provides insights on improving their fitness routines. You will be given a small set of data from the user, including activity type, duration, distance, and user's perceived intensity score out of 10. Use this data to generate a concise summary of the user's activity and present some insights or further data you can gather from what was inputted. Then suggest 1 way to enhance their fitness regimen. Use at most 3 sentences in your response."
    }

    activity_type = input("Enter activity type (Running, Biking, Swimming): ")
        
    if activity_type == "Running":
        user_data = '{"type": "Running", "distance": "4.92 miles", "duration": "00:41:52","pace": "8:31 min/mile", "perceived intensity": "9", "cadence": "155 spm","elevation_gain": "312 ft"}'
    
    elif activity_type == "Biking":
        user_data = '{"type": "Biking", "distance": "", "duration": "", "pace": "", "perceived intensity": "", "rpm": "", "elevation_gain": ""}'

    elif activity_type == "Swimming":
        user_data = '{"type": "Swimming", "distance": "", "duration": "", "pace": "", "perceived intensity": "", "stroke": ""}'

    else:
        raise ValueError("Unsupported activity type!")

    response = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=[
            system_message,
            {"role": "user", "content": user_data}
        ],
    )

    chatbot_response = response.choices[0].message.content
    print("Chatbot: " + chatbot_response)
        

if __name__ == "__main__":
    chatbot_conversation()
