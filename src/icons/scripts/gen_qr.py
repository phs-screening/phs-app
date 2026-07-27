# scripts/gen_qr.py — run once
import qrcode, base64, io

## Change the links here, do not change anything else
links = {
    "bloodpressureQR": "https://www.myheart.org.sg/heart-news/blood-pressure-reading/",
    "bmiQR":           "https://www.myheart.org.sg/heart-news/blood-pressure-reading/",
    "tempQR":          "https://www.myheart.org.sg/heart-news/blood-pressure-reading/",
}

def data_url(url):
    qr = qrcode.QRCode(
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=16,   # ~512px for a typical URL
        border=2,      # quiet zone in modules
    )
    qr.add_data(url)
    qr.make(fit=True)
    buf = io.BytesIO()
    qr.make_image(fill_color="black", back_color="white").save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

entries = {name: data_url(url) for name, url in links.items()}

body = "\n".join(f'const {n} = "{d}"' for n, d in entries.items())
exports = ", ".join(entries)

with open("../QRCodes.js", "w") as f:
    f.write(f"{body}\n\nexport {{\n    {exports}\n}}\n")
