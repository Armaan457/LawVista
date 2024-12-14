import requests
from bs4 import BeautifulSoup
import re
import os
import requests
import os
from decouple import config
from langchain_community.document_loaders import TextLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
pinecone_api_key = config('PINECONE_API_KEY')


os.environ["PINECONE_API_KEY"] = pinecone_api_key
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
def clean_escape_sequences(text):
    """
    Removes escape sequences from the given text.

    Args:
        text (str): The input text containing escape sequences.

    Returns:
        str: Cleaned text without escape sequences.
    """
    # Replace escape sequences with a space
    cleaned_text = re.sub(r'\s+', ' ', text)
    return cleaned_text.strip()

def extract_case_details(docid):
    """
    Extract case details from Indian Kanoon using the given docid.

    Args:
        docid (str): The document ID from the Indian Kanoon URL.

    Returns:
        dict: A dictionary containing case details.
    """
    # Base URL
    base_url = f"https://indiankanoon.org/doc/{docid}/"

    # Headers to mimic a real browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }

    try:
        # Fetch the webpage content
        response = requests.get(base_url, headers=headers)
        response.raise_for_status()  # Raise an HTTPError for bad responses

        # Parse the content with BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract text from the div with class "judgments"
        judgments_div = soup.find('div', class_='judgments')
        judgments_text = judgments_div.get_text(strip=True, separator="\n") if judgments_div else "Not Found"

        # Clean escape sequences
        cleaned_judgments_text = clean_escape_sequences(judgments_text)

        # Extract other case details
        return save_case_as_txt(cleaned_judgments_text, docid)



    except requests.exceptions.RequestException as e:
        return {"Error": f"Failed to fetch data: {str(e)}"}





def save_case_as_txt(case_details, docid):
    """
    Saves the extracted case details to a text file.

    Args:
        case_details (str): The case details text.
        docid (str): The docid of the case, used as the filename.

    Returns:
        str: The filename of the saved text file.
    """
    os.makedirs("case_files", exist_ok=True)  # Create directory if it doesn't exist
    filename = f"case_files/{docid}.txt"
    with open(filename, 'w', encoding='utf-8') as txt_file:
        txt_file.write(case_details)
    print(f"Saved case details to {filename}")

    addToPineCone(filename)
    print("added")
    return filename


from langchain.docstore.document import Document

def addToPineCone(filepath):
    """
    Adds case details to Pinecone after splitting them into chunks.

    Args:
        filepath (str): Path to the text file containing case details.
    """




    loader = TextLoader(filepath)
    docs = loader.load()



    splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=300)
    final_doc = splitter.split_documents(docs)


    # Add the chunks to Pinecone
    vectorstore = PineconeVectorStore.from_documents(final_doc, index_name="search-engine", embedding=embeddings,  pinecone_api_key= pinecone_api_key)


def main():
    """
    Main function to extract case details from Indian Kanoon and save them to a text file.
    """
    # The docid for the case to fetch
    docid = "9984231"

    # Call the extract_case_details function
    case_file = extract_case_details(docid)

    # Check if the case file was saved successfully
    if isinstance(case_file, dict) and "Error" in case_file:
        print(f"Error: {case_file['Error']}")
    else:
        print(f"Case details successfully saved to {case_file}")

# Run the main function
if __name__ == "__main__":
    main()
