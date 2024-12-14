import requests
from bs4 import BeautifulSoup
import json
import os


def download_case_pdf(docid):
    """
    Downloads the PDF of the case using the docid.

    Args:
        docid (str): The document ID from the Indian Kanoon URL.

    Returns:
        str: The path to the saved PDF file or an error message.
    """
    base_url = f"https://indiankanoon.org/doc/{docid}/"

    # Headers as captured from your network request
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

    # Payload for the POST request
    payload = {
        'type': 'pdf'
    }

    # Cookie captured from the browser session
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
        if response.headers.get('Content-Type') == 'application/pdf':
            print(f"Downloading PDF for docid {docid}...")

            # Ensure the folder for PDFs exists
            os.makedirs("case_pdfs", exist_ok=True)

            # Save the PDF file
            pdf_filename = f"case_pdfs/case_{docid}.pdf"
            with open(pdf_filename, 'wb') as pdf_file:
                pdf_file.write(response.content)

            print(f"PDF saved as {pdf_filename}")
            return pdf_filename
        else:
            print("Failed to download PDF. Response is not a PDF.")
            print("Response Content-Type:", response.headers.get('Content-Type'))
            return None

    except requests.exceptions.RequestException as e:
        print(f"Failed to download PDF for docid {docid}: {e}")
        return None


def store_judgment_text(docid, judgment_text):
    """
    Store the judgment text in a .txt file with the docid as the filename.

    Args:
        docid (str): The document ID from the Indian Kanoon URL.
        judgment_text (str): The text of the judgment to be stored.

    Returns:
        str: The file path where the judgment is stored.
    """
    # Define the directory where the text files will be saved
    directory = 'judgment_texts'

    # Create the directory if it doesn't exist
    if not os.path.exists(directory):
        os.makedirs(directory)

    # Define the file path
    file_path = os.path.join(directory, f'{docid}.txt')
    txt_pathName = f'judgment_texts/{docid}.txt'

    # Write the judgment text to the file
    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(judgment_text)
        return txt_pathName
    except Exception as e:
        return f"Failed to store judgment text: {str(e)}"


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

        # skip this div class ad_doc in judgements
        ad_divs = soup.find_all('div', class_='ad_doc')
        for ad_div in ad_divs:
            ad_div.decompose()  # This removes the ad-doc div from the parsed HTML

        judgments_div = soup.find('div', class_='judgments')
        if judgments_div:
            judgments_text = ""
            for child in judgments_div.find_all(recursive=False):
                if child.name == 'pre':
                    # Include the <pre> tags directly in the output
                    judgments_text += f"<pre>{child.text.strip()}</pre><br />"
                else:
                    # Add text with <br /> for other tags
                    judgments_text += child.get_text(separator="<br />", strip=True) + "<br />"
        else:
            judgments_text = "Not Found"

        # Store the judgment text in a file
        text_file_path = store_judgment_text(docid, judgments_text)

        pdf_path = download_case_pdf(docid)

        # Extract case details
        case_details = {
            "Case_id": docid,
            "Case_Title": soup.find('h2', class_='doc_title').text.strip() if soup.find('h2',
                                                                                        class_='doc_title') else "Not Found",
            "Court_Name": soup.find('h2', class_='docsource_main').text.strip() if soup.find('h2',
                                                                                             class_='docsource_main') else "Not Found",
            "Judgment_Author": soup.find('h3', class_='doc_author').find('a').text.strip() if soup.find('h3',
                                                                                                        class_='doc_author') else "Not Found",
            "Bench": soup.find('h3', class_='doc_bench').find('a').text.strip() if soup.find('h3',
                                                                                             class_='doc_bench') else "Not Found",
            "Citations": soup.find('h3', class_='doc_citations').text.split(':')[-1].strip() if soup.find('h3',
                                                                                                          class_='doc_citations') else "Not Found",
            "Issues": [p.text.strip() for p in soup.find_all('p', {'data-structure': 'Issue'})],
            "Facts": [p.text.strip() for p in soup.find_all('p', {'data-structure': 'Facts'})],
            "Conclusions": [p.text.strip() for p in soup.find_all('p', {'data-structure': 'Conclusion'})],
            "PDF_Path": pdf_path if pdf_path else "PDF download failed",
            "judgement_path": text_file_path if text_file_path else "Text file creation failed"
        }

        return case_details

    except requests.exceptions.RequestException as e:
        return {"Error": f"Failed to fetch data: {str(e)}"}
    except Exception as e:
        return {"Error": f"An error occurred: {str(e)}"}


# Function to extract docids from a search result page
def extract_docids(page_num, search_query):
    """
    Extracts all docids from the given search page.

    Args:
        page_num (int): The page number to extract docids from.
        search_query (str): The search query parameter.

    Returns:
        list: A list of docids found on the page.
    """
    base_url = f"https://indiankanoon.org/search/?formInput={search_query}&pagenum={page_num}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
    }

    try:
        response = requests.get(base_url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        docid_links = soup.find_all('a', string='Full Document')

        docids = [link['href'].split('/')[2] for link in docid_links if '/doc/' in link['href']]
        return docids

    except requests.exceptions.RequestException as e:
        print(f"Error fetching page {page_num}: {e}")
        return []


# Function to save case details as JSON
def save_case_as_json(case_details, docid):
    """
    Saves the extracted case details to a JSON file.

    Args:
        case_details (dict): The case details dictionary.
        docid (str): The docid of the case, used as the filename.
    """
    os.makedirs("case_files", exist_ok=True)  # Create directory if it doesn't exist
    filename = f"case_files/case_{docid}.json"
    with open(filename, 'w', encoding='utf-8') as json_file:
        json.dump(case_details, json_file, indent=4, ensure_ascii=False)
    print(f"Saved case details to {filename}")


# Function to extract case details for all docids on a page
def process_page(page_num):
    """
    Extracts case details for all docids on a given search result page and saves them as JSON.

    Args:
        page_num (int): The page number to process.
    """
    print(f"Processing page {page_num}...")
    docids = extract_docids(page_num)

    if not docids:
        print(f"No docids found on page {page_num}.")
        return

    for docid in docids:
        case_details = extract_case_details(docid)
        save_case_as_json(case_details, docid)


# Function to scrape multiple pages
# Function to scrape multiple pages for each keyword
def scrape_pages(start_page=1, end_page=40):
    """
    Scrapes multiple pages of search results for various queries and processes cases.

    Args:
        start_page (int): The starting page number.
        end_page (int): The ending page number (inclusive).
    """
    # List of search queries (keywords) to be used for scraping
    search_queries = [
        "OMP (E) (COMM.)",
        "ARB. A. (COMM.)",
        "C.O.(COMM.IPD-CR)",
        "C.A.(COMM.IPD-GI)",
        "C.A.(COMM.IPD-TM)"
    ]

    # Loop through each search query
    for query in search_queries:
        print(f"Scraping for query: {query}")

        # For each search query, process pages from start_page to end_page
        for page_num in range(start_page, end_page + 1):
            print(f"Processing page {page_num} for query: {query}")

            # Extract document IDs from the current page and search query
            docids = extract_docids(page_num, search_query=query)

            if not docids:
                print(f"No docids found on page {page_num} for query: {query}.")
                continue

            # For each docid found, extract case details and save them
            for docid in docids:
                case_details = extract_case_details(docid)
                save_case_as_json(case_details, docid)


# Example Usage
if __name__ == "_main_":
    scrape_pages(start_page=1, end_page=2)