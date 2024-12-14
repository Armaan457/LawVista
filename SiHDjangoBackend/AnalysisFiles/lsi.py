import threading
from queue import Queue

from decouple import config
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_pinecone import PineconeVectorStore
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate
from openai import OpenAI
# from openai import OpenAI
import os

groq_api_key = config('GROQ_API_KEY_3')

import json



llm = ChatGroq(
    temperature=0,
    model_name="llama3-8b-8192",
    groq_api_key=groq_api_key
)

openai_api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=openai_api_key)

def process_chunk(chunk, output_queue):
    try:
        prompt = f"""
        You are an AI trained in legal analysis. Extract the key legal statutes, laws, and concepts referenced in the following case text:

        Case File : {chunk}

        Response format:
        Key Statutes: <List of key statutes and laws>
        Summary: <summary of the statues and laws involved in the case file not the company involved in the case>
        """
        response = llm.invoke(prompt)
        output_queue.put(response.content)
    except Exception as e:
        output_queue.put(f"Error: {str(e)}")

def process_output(chunk, output_queue):
    try:
        prompt = f"Analyze the following text and provide all the legal statutes and laws you came across:\n\n{chunk}. You have to reply such that the law name and its description is separated by a colon. Description should be 2-3 lines long."
        response = llm.invoke(prompt)
        output_queue.put(response.content)
    except Exception as e:
        output_queue.put(f"Error: {str(e)}")

def legal_st(file_contents):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    contents = splitter.split_text(file_contents)

    output_queue = Queue()
    threads = []

    # Step 1: Process chunks concurrently
    for chunk in contents:
        thread = threading.Thread(target=process_chunk, args=(chunk, output_queue))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    ans = ""
    while not output_queue.empty():
        ans += output_queue.get()

    words = ans.split()
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + 1000, len(words))
        chunks.append(" ".join(words[start:end]))
        start += 1000 - 200

    # Step 2: Analyze outputs concurrently
    outputs = []
    threads = []
    output_queue = Queue()

    for chunk in chunks:
        thread = threading.Thread(target=process_output, args=(chunk, output_queue))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    while not output_queue.empty():
        outputs.append(output_queue.get())

    # Step 3: Combine all outputs into a single result
    combined_output = "\n".join(outputs)

    chat_completion = client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system",
             "content": "You extract laws put it as the key in json object and its value will be a very detailed summary (300-400 words) of the law in markdown language with proper hierarchy and structure"},
            {"role": "user", "content": combined_output}
        ],

        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "statutes",
                "schema": {
                    "type": "object",
                    "properties": {
                        "statutes": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "Law": {"type": "string", "description": "name of the law"},
                                    "description": {"type": "string",
                                                    "description": "description of law in 300 words with markdown"}
                                },
                                "required": ["Law", "description"]
                            }
                        }
                    },
                    "required": ["statutes"]
                }
            }
        },
        temperature=0,
    )

    return json.loads(chat_completion.choices[0].message.content)["statutes"]


def main():
    file_contents = """
    Your hardcoded string goes here. This text will be processed by the legal_st function.
    """

    statutes = legal_st(file_contents)

    print("Extracted Statutes and Descriptions:")
    print(json.dumps(statutes, indent=4))

if __name__ == "__main__":
    main()