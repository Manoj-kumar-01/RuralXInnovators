import fitz
doc = fitz.open("Untitled document (2).pdf")
with open("pdf_output.txt", "w", encoding="utf-8") as f:
    for page in doc:
        f.write(page.get_text())
