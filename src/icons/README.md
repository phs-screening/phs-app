# Icons and QR Code Assets

This directory stores JavaScript-embedded image assets used by the PHS frontend and generated patient reports.

Most files in this folder export base64 image data so the report generators can embed images directly into PDFs without loading separate image files at runtime.

## QR Code Assets

`QRCodes.js` is generated from `scripts/gen_qr.py`. It exports PNG data URLs for:

- `bloodpressureQR`
- `bmiQR`
- `tempQR`

These exports are currently consumed by:

- `src/reports/patientReportPdfUpdated.js`, which embeds all three QR codes in the pdfMake report sections.
- `src/reports/patientReportPdf.js`, which embeds the blood pressure and BMI QR codes in the legacy jsPDF report.

Do not hand-edit `QRCodes.js` unless you are making a temporary local experiment. Regenerate it from the script instead so the output remains consistent and repeatable.

## Regenerating `QRCodes.js`

1. Open `src/icons/scripts/gen_qr.py`.
2. Update the `links` dictionary. The object keys must stay aligned with the imports used by the report files:

   ```python
   links = {
       "bloodpressureQR": "https://example.com/blood-pressure-resource",
       "bmiQR": "https://example.com/bmi-resource",
       "tempQR": "https://example.com/temperature-resource",
   }
   ```

3. Install the Python dependency if needed:

   ```powershell
   python -m pip install qrcode[pil]
   ```

4. Run the generator from the scripts directory:

   ```powershell
   cd src/icons/scripts
   python gen_qr.py
   ```

   The script writes `../QRCodes.js`, which resolves to `src/icons/QRCodes.js`.

5. Review the generated diff before committing. The file will contain long base64 strings, so the diff is expected to be large even for a small URL change.

## Generator Details

The generator builds each QR code with:

- Medium QR error correction: `qrcode.constants.ERROR_CORRECT_M`
- `box_size=16`, producing a high-resolution PNG suitable for PDF embedding
- `border=2`, preserving the QR quiet zone
- PNG data URL output in the form `data:image/png;base64,...`

The generated module uses named exports so report code can import only the QR codes it needs.

## Maintenance Notes

- Keep QR export names stable unless you also update every importing report file.
- Verify that each URL opens correctly before regenerating the QR codes.
- When adding a new QR code, add it to `links`, regenerate `QRCodes.js`, and import the new named export where it is rendered.
- After updating QR codes, generate a sample patient report and scan each QR code from the PDF to confirm the embedded images are readable.
