import requests
import os

from langchain_pinecone import PineconeVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter


embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")



r2_base_url =  "https://pub-d58fae2843f34cfcbf2cfb0606b5efaf.r2.dev/judgmenttxts/"

def download_case_pdf(docid):
    """
    Downloads the PDF of the case using the docid and uploads it to an R2 bucket.

    Args:
        docid (str): The document ID from the Indian Kanoon URL.

    Returns:
        str: The remote R2 URL of the uploaded PDF file or None if the upload failed.
    """
    # Base URL for the case
    base_url = f"https://indiankanoon.org/doc/{docid}/"

    # Base URL for your R2 bucket - adjust this to match your bucket endpoint
    # For example: "https://<account-id>.r2.cloudflarestorage.com/<bucket-name>"
    r2_base_url = "https://your-r2-bucket-url-here"

    # Headers from the network request
    headers = {
        'Host': 'indiankanoon.org',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,/;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': base_url,
        'Origin': 'https://indiankanoon.org',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    }

    payload = {
        'type': 'pdf'
    }

    cookies = {
        'sessionid': '8m85t2lr7cvbpicd4blij4mkpslhwocg',
        '_ga_HML2J37TKY': 'GS1.1.1733758250.3.1.1733759870.0.0.0',
        '_ga': 'GA1.1.385751919.1733638052',
        'cf_clearance': 'BqEkdex_iCmT4X0pw.55yBjuLsKwaDqWEdFtH4u_JLg-1733759872-1.2.1.1-rckMm4lipUqq...'
    }

    try:
        # Make the POST request to fetch the PDF
        response = requests.post(base_url, headers=headers, data=payload, cookies=cookies)
        response.raise_for_status()

        # Check if the response is PDF
        if response.headers.get('Content-Type') == 'application/pdf':
            print(f"Downloading PDF for docid {docid}...")

            pdf_data = response.content
            r2_pdf_path = f"case_{docid}.pdf"
            upload_url = f"{r2_base_url}/{r2_pdf_path}"

            # Headers for the R2 upload
            # If using signed URLs, you may not need auth headers.
            # Otherwise, use AWS auth or your R2 credentials.
            r2_headers = {
                "Content-Type": "application/pdf"
                # Add authentication headers if required (e.g. AWS Signature headers)
            }

            put_response = requests.put(upload_url, headers=r2_headers, data=pdf_data)
            if put_response.status_code == 200:
                print(f"PDF successfully uploaded to {upload_url}")
                return upload_url
            else:
                print(f"Failed to upload PDF to R2. Status: {put_response.status_code}")
                print("Response:", put_response.text)
                return None
        else:
            print("Failed to download PDF. Response is not a PDF.")
            print("Response Content-Type:", response.headers.get('Content-Type'))
            return None

    except requests.exceptions.RequestException as e:
        print(f"Failed to download PDF for docid {docid}: {e}")
        return None



def addToPineCone(docs):
    splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=300)
    final_doc = splitter.split_documents(docs)

    vectorstore = PineconeVectorStore.from_documents(final_doc, index_name="search-engine", embedding=embeddings)
    # retriever = vectorstore.as_retriever(
    #     search_type="similarity_score_threshold",
    #     search_kwargs={"k": 5, "score_threshold": 0.5},
    # )

    retriever = vectorstore.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={"k": 5, "score_threshold": 0.5},
    )

