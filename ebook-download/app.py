from flask import Flask, send_file
import os

app = Flask(__name__)

PDF_FILE = "PromptProHub.pdf"


@app.route("/")
def home():
    return "PromptPro Hub ebook download service is running."


@app.route("/download")
def download_ebook():
    if not os.path.exists(PDF_FILE):
        return "Ebook file not found.", 404

    return send_file(
        PDF_FILE,
        as_attachment=True,
        download_name="PromptProHub.pdf",
        mimetype="application/pdf"
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)
