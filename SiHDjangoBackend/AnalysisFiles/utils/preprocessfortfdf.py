import re

def clean_document(input_string):
    """
    Cleans the given document string by removing paragraph labels, dots from abbreviations,
    and other punctuation marks.

    Args:
        input_string (str): The raw document as a single string.

    Returns:
        str: The cleaned document.
    """
    # Split the input string into lines
    documents = input_string.strip().split("\n")

    # Find the starting line of the main content
    for i in range(len(documents)):
        if documents[i].startswith("1."):
            break
    doc = documents[i:]

    # Process each line
    temp = ""
    for eachDocument in doc[:]:
        # Remove paragraph labels like 1., 2., etc.
        eachDocument = re.sub(r'(\d\d\d|\d\d|\d)\.\s', ' ', eachDocument)
        # Remove dots in cases like File No.1063
        eachDocument = re.sub(r'(?<=[a-zA-Z])\.(?=\d)', '', eachDocument)
        # Remove ending dots of abbreviations
        eachDocument = re.sub(r'(?<=\d|[a-zA-Z])\.(?=\s[\da-z])', ' ', eachDocument)
        # Remove dots after abbreviations
        eachDocument = re.sub(r'(?<=\d|[a-zA-Z])\.(?=\s?[\!\"\#\$\%\&\'\(\)\*\+\,\-\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~])', '', eachDocument)
        # Remove other punctuation marks
        eachDocument = re.sub(r'(?<!\.)[\!\"\#\$\%\&\'\(\)\*\+\,\-\/\:\;\<\=\>\?\@\[\\\]\^\_\`\{\|\}\~]', ' ', eachDocument)

        # Concatenate the cleaned line
        temp += eachDocument

    # Remove extra spaces and process the final document
    temp = temp.replace("  ", " ")  # Replace double spaces with single space
    cleaned_document = temp.lstrip()  # Remove leading space

    return cleaned_document


if __name__ == "__main__":
    input_text = """
    Delhi High Court - OrdersAstrazeneca Ab & Anr vs Intas Pharmaceuticals Limited on 23 March, 2021Author:Rajiv Sahai EndlawBench:Rajiv Sahai Endlaw,Amit Bansal$~11-19
                          *      IN THE HIGH COURT OF DELHI AT NEW DELHI
                          +      FAO(OS) (COMM) 139/2020 & CM APPL. 28068/2020 (for placing
                                 on record additional documents), CM APPL. 28070/2020 (for interim
                                 stay) & CM APPL. 32664/2020 (for intervention)
                                 ASTRAZENECA AB & ANR.                          ..... Appellants
                                                       Through:       Mr. Pravin Anand, Ms. Vaishali
                                                                      Mittal, Mr. Siddhant Chamola, Mr.
                                                                      Rohin Koolwal and Mr. Souradeep
                                                                      Mukhopadhyay, Advocates.

                                                       versus

                                 INTAS PHARMACEUTICALS LIMITED          ..... Respondent
                                             Through: Mr. C. S. Vaidhyanathan, Senior
                                                      Counsel with Ms. Bitika Sharma, Mr.
                                                      Adarsh Ramanujan, Ms. Nitya
                                                      Sharma, Mr. Ramanujan, Ms. Nitya
                                                      Sharma, Mr. Devanshu Khanna, Ms.
                                                      Vrinda Pathak, Mr. Vikram Singh
                                                      Dalal, Mr. Akshay Nagarajan and Mr.
                                                      R. V. Prabhat, Advocates.

                                                       AND

                          +      FAO(OS) (COMM) 140/2020 & CM APPL. 28072/2020 ( for placing
                                 on record additional documents) & CM APPL. 28074/2020 (for stay)
                                 ASTRAZENECA AB & ANR.                         ..... Appellants
                                                       Through:       Mr. Pravin Anand, Ms. Vaishali
                                                                      Mittal, Mr. Siddhant Chamola, Mr.
                                                                      Rohin Koolwal and Mr. Souradeep
                                                                      Mukhopadhyay, Advocates.
                                                       versus




Signature Not Verified
Signed By:ASHWANI         FAO(OS) (COMM) 139/2020 and connected matters                        Page 1 of 5
Signing Date:05.04.2021
15:59:50
                                  ALKEM LABORATORIES LIMITED             ..... Respondent
                                             Through: Mr. C. S. Vaidhyanathan, Senior
                                                      Counsel with Ms. Bitika Sharma, Mr.
                                                      Adarsh Ramanujan, Ms. Nitya
                                                      Sharma, Mr. Ramanujan, Ms. Nitya
                                                      Sharma, Mr. Devanshu Khanna, Ms.
                                                      Vrinda Pathak, Mr. Vikram Singh
                                                      Dalal, Mr. Akshay Nagarajan and Mr.
                                                      R. V. Prabhat, Advocates.

                                                    AND
                          +      FAO(OS) (COMM) 155/2020 & CM APPL. 30695/2020 (for placing
                                 on record additional documents), CM APPL. 30696/2020 (for
                                 exemption) & CM APPL. 30697/2020 (for interim stay)
                                 ASTRAZENECA AB & ANR.                          ..... Appellants
                                                       Through:       Mr. Pravin Anand, Ms. Vaishali
                                                                      Mittal, Mr. Siddhant Chamola, Mr.
                                                                      Rohin Koolwal and Mr. Souradeep
                                                                      Mukhopadhyay, Advocates.

                                                       versus

                                 ZYDUS HEALTHCARE LIMITED & ANR.        ..... Respondents
                                             Through: Mr. C. S. Vaidhyanathan, Senior
                                                      Counsel with Ms. Bitika Sharma, Mr.
                                                      Adarsh Ramanujan, Ms. Nitya
                                                      Sharma, Mr. Ramanujan, Ms. Nitya
                                                      Sharma, Mr. Devanshu Khanna, Ms.
                                                      Vrinda Pathak, Mr. Vikram Singh
                                                      Dalal, Mr. Akshay Nagarajan and Mr.
                                                      R. V. Prabhat, Advocates.

                                                    AND
                          +      FAO(OS) (COMM) 156/2020 & CM APPL. 30698/2020 (for placing
                                 on record additional documents), CM APPL. 30699/2020 (for
                                 exemption) & CM APPL. 30700/2020 (for interim stay)




Signature Not Verified
Signed By:ASHWANI         FAO(OS) (COMM) 139/2020 and connected matters                        Page 2 of 5
Signing Date:05.04.2021
15:59:50
                                  ASTRAZENECA AB & ANR.                                 ..... Appellants
                                                       Through:       Mr. Pravin Anand, Ms. Vaishali
                                                                      Mittal, Mr. Siddhant Chamola, Mr.
                                                                      Rohin Koolwal and Mr. Souradeep
                                                                      Mukhopadhyay, Advocates.
                                                       versus

                                 ERIS LIFESCIENCES LTD.                                ..... Respondent
                                               Through:               None.

                                              AND
                          +      FAO(OS) (COMM) 157/2020 & CM APPL. 30701/2020 (for placing
                                 on records additional documents), CM APPL. 30702/2020 (for
                                 exemption), CM APPL. 30703/2020 (for interim stay) & CM APPL.
                                 1153/2021 (for intervention)
                                 ASTRAZENECA AB & ANR.                                 ..... Appellants
                                                       Through:       Mr. Pravin Anand, Ms. Vaishali
                                                                      Mittal, Mr. Siddhant Chamola, Mr.
                                                                      Rohin Koolwal and Mr. Souradeep
                                                                      Mukhopadhyay, Advocates.
                                               versus
                                 USV PRIVATE LIMITED                                    ..... Respondent
                                               Through:               Mr. J. Sai Deepak, Mr. Guruswamy
                                                                      Nataraj, Mr. Avinash K. Sharma, Mr.
                                                                      R. Abhishek and Mr. Ankur Vyas,
                                                                      Advocates.
                                                    AND
                          +      FAO(OS) (COMM) 158/2020 & CM APPL. 30704/2020 (for placing
                                 on record additional documents), CM APPL. 30705/2020 (for
                                 exemption) & CM APPL. 30706/2020 (for interim stay)
                                 ASTRAZENECA AB & ANR.                          ..... Appellants
                                                       Through:       Mr. Pravin Anand, Ms. Vaishali
                                                                      Mittal, Mr. Siddhant Chamola, Mr.
                                                                      Rohin Koolwal and Mr. Souradeep
                                                                      Mukhopadhyay, Advocates.


Signature Not Verified
Signed By:ASHWANI         FAO(OS) (COMM) 139/2020 and connected matters                           Page 3 of 5
Signing Date:05.04.2021
15:59:50
                                                        versus

                                 TORRENT PHARMACEUTICALS LIMITED                       ..... Respondent
                                             Through: None.

                                                    AND
                          +      FAO(OS) (COMM) 159/2020 & CM APPL. 30707/2020 (for placing
                                 on record additional documents), CM APPL. 30708/2020 (for
                                 exemption) & CM APPL. 30709/2020 (for interim stay)
                                 ASTRAZENECA AB & ANR.                          ..... Appellants
                                                       Through:       Mr. Pravin Anand, Ms. Vaishali
                                                                      Mittal, Mr. Siddhant Chamola, Mr.
                                                                      Rohin Koolwal and Mr. Souradeep
                                                                      Mukhopadhyay, Advocates.
                                                       versus

                                 MSN LABORATORIES PVT. LTD.                       ..... Respondent
                                                    Through: Mr. J. Sai Deepak, Mr. Guruswamy
                                                                Nataraj, Mr. Avinash K. Sharma, Mr.
                                                                R. Abhishek and Mr. Ankur Vyas,
                                                                Advocates.
                                                    AND
                          +      FAO(OS) (COMM) 160/2020 & CM APPL. 30710/2020 (for placing
                                 on record additional documents), CM APPL. 30711/2020 (for
                                 exemption) & CM APPL. 30712/2020 (for interim stay)
                                 ASTRAZENECA AB & ANR.                            ..... Appellant
                                                       Through:       Mr. Pravin Anand, Ms. Vaishali
                                                                      Mittal, Mr. Siddhant Chamola, Mr.
                                                                      Rohin Koolwal and Mr. Souradeep
                                                                      Mukhopadhyay, Advocates.
                                              versus
                                 MICRO LABS LTD.                                        ..... Respondent
                                              Through:                Mr. J. Sai Deepak, Mr. Guruswamy
                                                                      Nataraj, Mr. Avinash K. Sharma, Mr.
                                                                      R. Abhishek and Mr. Ankur Vyas,
                                                                      Advocates.


Signature Not Verified
Signed By:ASHWANI         FAO(OS) (COMM) 139/2020 and connected matters                           Page 4 of 5
Signing Date:05.04.2021
15:59:50
                                                        AND

                          +      FAO(OS) (COMM) 161/2020 & CM APPL. 30713/2020 (for placing
                                 on record additional documents), CM APPL. 30714/2020 (for
                                 exemption) & CM APPL. 30715/2020 (for interim stay)
                                 ASTRAZENECA AB & ANR.                          ..... Appellants
                                                       Through:       Mr. Pravin Anand, Ms. Vaishali
                                                                      Mittal, Mr. Siddhant Chamola, Mr.
                                                                      Rohin Koolwal and Mr. Souradeep
                                                                      Mukhopadhyay, Advocates.
                                                       versus

                              AJANTA PHARMA LIMITED              ..... Respondent
                                             Through: None.
                          CORAM:
                          HON'BLE MR. JUSTICE RAJIV SAHAI ENDLAW
                          HON'BLE MR. JUSTICE AMIT BANSAL
                                       ORDER%            23.03.20211.     Mr. C.S. Vaidhyanathan, Senior Counsel for the respondents, has
                          been heard for one and half hours.2.     Hearing to continue on 24th March, 2021.RAJIV SAHAI ENDLAW, J


                                                                           AMIT BANSAL, J


                          MARCH 23, 2021/srSignature Not VerifiedSigned By:ASHWANI         FAO(OS) (COMM) 139/2020 and connected matters                        Page 5 of 5Signing Date:05.04.202115:59:50
    """
    summary = clean_document(input_text)
    with open('output.txt', 'w') as output_file:
        output_file.write("Summary:\n")
        output_file.write(summary)
