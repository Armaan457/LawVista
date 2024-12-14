from utils.classifyIfRag import classify_query
from utils.extractingKeywords import extract_search_terms
from utils.findCombinedQuestion import get_standalone_question
from utils.IndianKanoon import IndianKanoon
import json





def legal_assistant(chat_history, user_input):
    # ques = get_standalone_question(chat_history, user_input)
    # print(ques)
    # choice = classify_query(ques)
    # print("THE CHOICE IS:" + choice)
    # if choice == 2:
    #     response = llm.invoke(user_input).content
    #     return response


    # search_terms = extract_search_terms(ques)
    # print(search_terms)
    indian_kanoon = IndianKanoon()
    search_terms = "M/S Priyanav Wellness Pvt Ltd vs Pradyuman Kumar"
    search_results = indian_kanoon.search(search_terms, pagenum=0)
    # print(search_results)
    first_tid = search_results["docs"][0]["tid"]
    print(first_tid)








def main():
    # Sample chat history and user input
    chat_history = [
        {"role": "user", "content": "What is the procedure for filing a civil case?"},
        {"role": "assistant", "content": "The procedure for filing a civil case involves several steps..."}
    ]
    user_input = "M/S Priyanav Wellness Pvt Ltd vs Pradyuman Kumar"

    # Call the legal_assistant function
    response = legal_assistant(chat_history, user_input)

    # Print the response
    print("Legal Assistant Response:")
    print(json.dumps(response, indent=4))

if __name__ == "__main__":
    main()


