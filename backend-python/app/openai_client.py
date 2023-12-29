from typing import List, Optional
from dotenv import load_dotenv
import os

from langchain.chat_models import ChatOpenAI
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)

class OpenAIModel:
    def __init__(self, openai_api_key: str, openai_org_id: str, hashtags: Optional[List[str]] = None):
        self.model = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            openai_api_key=openai_api_key,
            openai_organization=openai_org_id,
        )

        if hashtags is None:
            self.hashtags = ["#science", "#art", "#sport", "#technology", "#music", "#nature", "#food", "#travel", "#fashion", "#fitness", "#photography", "#business", "#health", "#life", "#love", "#style", "#beauty", "#design", "#inspiration", "#motivation", "#fun", "#family", "#home", "#holiday", "#party"]
        else:
            self.hashtags = hashtags

    def extract_hashtags(self, description: str) -> List[str]:
        system_template = "Respond only with 3 hashtags from the list: {hashtags}."
        system_message_prompt = SystemMessagePromptTemplate.from_template(system_template)
        system_message_prompt = system_message_prompt.format(hashtags=" ".join(self.hashtags))

        human_template = (
            "You are a expert in extracting exactly 3 relevant hashtags from social media post description. This is a post description: {text}. Extract only hashtags from this list of hashtags: {hashtags}."
        )
        human_message_prompt = HumanMessagePromptTemplate.from_template(human_template)
        human_message_prompt = human_message_prompt.format(
            text=description, hashtags=" ".join(self.hashtags)
        )

        chat_prompt = ChatPromptTemplate.from_messages(
            [system_message_prompt, human_message_prompt]
        )

        response = self.model(
            chat_prompt.format_prompt().to_messages()
        )
        response = response.content.split(" ")
        return response
        

load_dotenv()

openai_model = OpenAIModel(
    openai_api_key=os.getenv('OPENAI_API_KEY'),
    openai_org_id=os.getenv('OPENAI_ORG_ID'),
)


if __name__ == "__main__":
    post_description = "I went for a walk in the park, saw a beautiful waterfall and decided to take a picture."

    response = openai_model.extract_hashtags(post_description)
    print(response)
