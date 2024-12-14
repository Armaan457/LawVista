import requests
from urllib.parse import urljoin
from datetime import datetime
from bs4 import BeautifulSoup
class IndianKanoon:
  """
    Search query	https://api.indiankanoon.org/search/?formInput=<query>&pagenum=<pagenum>
    Document	https://api.indiankanoon.org/doc/<docid>/
    Document fragments	https://api.indiankanoon.org/docfragment/<docid>/?formInput=<query>
    Document Metainfo	https://api.indiankanoon.org/docmeta/<docid>/
  """

  def __init__(self):
    self.base_url = "https://api.indiankanoon.org/"
    self.auth_token = "188a9f2c751d5be2af19846d701ab1272a0cf7f2"

    self.headers = {
        'authorization': "Token {}".format(self.auth_token),
        'cache-control': "no-cache",
    }
    self.api_session = requests.Session()
    self.api_session.headers = self.headers

  def search(self, formInput, pagenum=0,
             fromdate=None, todate=None,
             title=None, author=None,
             cite=None, bench=None):
    #  Creating parameters
    params = {
        'formInput': formInput,
        'pagenum': pagenum,

    }
    if fromdate:
      assert isinstance(fromdate, datetime)
      params['fromdate'] = fromdate.strftime('%d-%m-&Y')

    if todate:
      assert isinstance(todate, datetime)
      params['todate'] = todate.strftime('%d-%m-&Y')
    print(params)
    # Making the request
    response = self.api_session.post(
        urljoin(self.base_url, 'search/'), params=params)
    response.raise_for_status()
    return response.json()

  def doc(self, docid):
    response = self.api_session.post(
        urljoin(self.base_url, 'doc/{}/'.format(docid)))
    response.raise_for_status()
    return response.json()

  def docfragment(self, docid, formInput):
    params = {
        'formInput': formInput,
    }
    response = self.api_session.post(
        urljoin(self.base_url, 'docfragment/{}/'.format(docid)), params=params)
    response.raise_for_status()
    return response.json()

  def docmeta(self, docid):
    response = self.api_session.post(
        urljoin(self.base_url, 'docmeta/{}/'.format(docid)))
    response.raise_for_status()
    return response.json()


import json


def main():
    # Initialize the IndianKanoon object
    indian_kanoon = IndianKanoon()

    # Define the search query for "commercial court"
    query = "Code of Civil Procedure Section 11"

    # Perform the search (assuming we're using page 0)
    search_results = indian_kanoon.search(query, pagenum=0)
    docid = 121631892
    doc_details = indian_kanoon.doc(docid)

    print("Pretty printed JSON response:\n")
    print(json.dumps(doc_details, indent=4))

    # Check if results are returned
    if search_results:
        # Pretty print the entire JSON response
        print("Pretty printed JSON response:\n")
        print(json.dumps(search_results, indent=4))

        # Optionally, process the 'docs' if present
        if 'docs' in search_results:
            docs = search_results['docs']
            print(f"\nFound {len(docs)} results for '{query}':\n")

            # Iterate through the docs and display structured information
            for i, doc in enumerate(docs):

                print(f"Result {i + 1}:\n")
                print(f"Title: {doc.get('title', 'N/A')}")
                print(f"Publication Date: {doc.get('publishdate', 'N/A')}")
                print(f"Document Source: {doc.get('docsource', 'N/A')}")
                print(f"Citation: {doc.get('citation', 'N/A')}")
                print(f"Number of Citations: {doc.get('numcites', 'N/A')}")
                print(f"Number of Times Cited: {doc.get('numcitedby', 'N/A')}")
                print(f"Headline: {doc.get('headline', 'N/A')}")

                # Document covers (if any)
                covers = doc.get('covers', [])
                if covers:
                    print("Document Covers:")
                    for cover in covers:
                        print(f" - {cover.get('title', 'No title')}")
                print("-" * 40)
    else:
        print("No results found for the query.")

def extract_docids(page_num, search_query="comm"):
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
        docid_links = soup.find_all('a', text='Full Document')

        docids = [link['href'].split('/')[2] for link in docid_links if '/doc/' in link['href']]
        return docids

    except requests.exceptions.RequestException as e:
        print(f"Error fetching page {page_num}: {e}")
        return []

if __name__ == "__main__":
    main()

