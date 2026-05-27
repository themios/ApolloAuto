#!/usr/bin/env python3
"""Split Apollo deal contract PDF into redacted section PDFs for buyer review."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE_PDF = ROOT / "documents" / "source" / "deal-contract-source.pdf"
OUT_DIR = ROOT / "documents" / "contract-sections"
TMP_DIR = ROOT / "documents" / ".tmp-pages"
DPI = 200

# Redaction boxes as (x1, y1, x2, y2) fractions of page width/height.
# White fill removes customer/vehicle/deal-specific data while preserving form layout.
PAGE_REDACTIONS: dict[int, list[tuple[float, float, float, float]]] = {
    3: [
        (0.04, 0.10, 0.96, 0.18),  # date/cost/temp plate row
        (0.04, 0.18, 0.96, 0.50),  # vehicle grid
        (0.04, 0.52, 0.68, 0.72),  # buyer / sold-to block
        (0.04, 0.78, 0.52, 0.86),  # purchaser signature
        (0.55, 0.72, 0.78, 0.78),  # dealer agent signature
    ],
    4: [
        (0.04, 0.10, 0.96, 0.18),
        (0.04, 0.18, 0.96, 0.50),
        (0.04, 0.52, 0.68, 0.72),
        (0.04, 0.78, 0.52, 0.86),
        (0.55, 0.72, 0.78, 0.78),
    ],
    5: [(0.07, 0.07, 0.93, 0.93)],
    6: [(0.08, 0.07, 0.93, 0.93)],
    7: [(0.78, 0.03, 0.96, 0.09)],
    8: [
        (0.05, 0.11, 0.95, 0.33),  # vin + vehicle grid values
        (0.05, 0.33, 0.95, 0.71),  # checked inspection boxes
        (0.05, 0.71, 0.95, 0.91),  # verifier + signatures
    ],
    10: [
        (0.07, 0.11, 0.93, 0.27),
        (0.07, 0.27, 0.93, 0.47),
        (0.07, 0.63, 0.93, 0.81),
        (0.07, 0.81, 0.93, 0.93),
    ],
    11: [
        (0.05, 0.105, 0.34, 0.19),  # buyer
        (0.35, 0.105, 0.64, 0.19),  # co-buyer
        (0.05, 0.205, 0.96, 0.235),  # vehicle row
        (0.05, 0.285, 0.96, 0.335),  # TILA headline amounts
        (0.52, 0.335, 0.96, 0.415),  # payment schedule amounts
        (0.67, 0.415, 0.96, 0.515),  # insurance premium amounts
        (0.55, 0.455, 0.96, 0.535),  # insurance signatures
        (0.05, 0.755, 0.96, 0.795),  # trade-in payoff signatures
        (0.05, 0.855, 0.96, 0.885),  # arbitration signatures
        (0.05, 0.915, 0.96, 0.945),  # footer signatures
    ],
    12: [
        (0.52, 0.06, 0.96, 0.52),  # dollar amount column
        (0.72, 0.52, 0.96, 0.84),  # trade-in vehicle details
        (0.05, 0.885, 0.96, 0.965),  # footer signatures
    ],
    13: [(0.05, 0.905, 0.96, 0.965)],
    14: [(0.05, 0.905, 0.96, 0.965)],
    15: [(0.05, 0.885, 0.96, 0.965)],
    16: [
        (0.05, 0.095, 0.96, 0.145),
        (0.05, 0.155, 0.96, 0.205),
        (0.05, 0.255, 0.96, 0.335),
        (0.05, 0.455, 0.96, 0.495),
        (0.05, 0.655, 0.96, 0.775),
        (0.05, 0.805, 0.96, 0.875),
    ],
    17: [
        (0.34, 0.105, 0.66, 0.215),
        (0.34, 0.225, 0.66, 0.335),
        (0.05, 0.365, 0.95, 0.395),
        (0.05, 0.725, 0.95, 0.855),
    ],
    18: [
        (0.06, 0.155, 0.72, 0.185),
        (0.74, 0.155, 0.94, 0.185),
        (0.06, 0.195, 0.94, 0.225),
        (0.06, 0.295, 0.94, 0.325),
        (0.06, 0.725, 0.94, 0.855),
    ],
    19: [
        (0.06, 0.125, 0.94, 0.175),
        (0.72, 0.175, 0.94, 0.195),
        (0.06, 0.575, 0.48, 0.655),
        (0.52, 0.575, 0.94, 0.655),
        (0.06, 0.885, 0.28, 0.935),
    ],
    20: [
        (0.06, 0.595, 0.48, 0.675),
        (0.52, 0.595, 0.74, 0.675),
        (0.76, 0.595, 0.94, 0.675),
        (0.06, 0.695, 0.48, 0.775),
        (0.52, 0.695, 0.94, 0.775),
    ],
    21: [
        (0.52, 0.105, 0.96, 0.235),
        (0.06, 0.245, 0.42, 0.305),
        (0.06, 0.525, 0.48, 0.655),
        (0.52, 0.655, 0.96, 0.855),
        (0.06, 0.725, 0.48, 0.805),
    ],
    22: [
        (0.04, 0.085, 0.96, 0.335),
        (0.04, 0.825, 0.96, 0.935),
    ],
    23: [(0.04, 0.085, 0.96, 0.285)],
}

SECTIONS = [
    {
        "id": "reg-262-transfer",
        "file": "reg-262-transfer-form.pdf",
        "title": "REG 262 — Vehicle transfer & reassignment",
        "description": "California DMV bill of sale, odometer disclosure, and buyer/seller signatures.",
        "pages": [1, 2],
    },
    {
        "id": "reg-51-report-of-sale",
        "file": "reg-51-report-of-sale.pdf",
        "title": "REG 51 — Report of sale (used vehicle)",
        "description": "Dealer and DMV copies of the used vehicle report of sale.",
        "pages": [3, 4],
    },
    {
        "id": "title-reassignment",
        "file": "title-reassignment.pdf",
        "title": "Title reassignment (sample layout)",
        "description": "Prior-state title and dealer reassignment pages from the deal jacket.",
        "pages": [5, 6],
    },
    {
        "id": "reg-396-wholesale",
        "file": "reg-396-wholesale-report.pdf",
        "title": "REG 396 — Wholesale report of sale",
        "description": "Wholesale odometer disclosure and dealer-to-dealer report of sale.",
        "pages": [7],
    },
    {
        "id": "reg-31-verification",
        "file": "reg-31-verification.pdf",
        "title": "REG 31 — Verification of vehicle",
        "description": "VIN verification form and California BTM reference codes.",
        "pages": [8, 9],
    },
    {
        "id": "smog-check-vir",
        "file": "smog-check-vir.pdf",
        "title": "Smog Check — Vehicle inspection report",
        "description": "California smog inspection results form (layout sample).",
        "pages": [10],
    },
    {
        "id": "risc-page-1",
        "file": "retail-installment-contract-page-1.pdf",
        "title": "Retail installment contract — Page 1",
        "description": "Truth-in-lending disclosures, insurance statement, and vehicle description.",
        "pages": [11],
    },
    {
        "id": "risc-page-2",
        "file": "retail-installment-contract-page-2.pdf",
        "title": "Retail installment contract — Page 2",
        "description": "Itemization of amount financed, optional products, and trade-in details.",
        "pages": [12],
    },
    {
        "id": "risc-page-3",
        "file": "retail-installment-contract-page-3.pdf",
        "title": "Retail installment contract — Page 3",
        "description": "Finance charge, payments, security interest, and default provisions.",
        "pages": [13],
    },
    {
        "id": "risc-page-4",
        "file": "retail-installment-contract-page-4.pdf",
        "title": "Retail installment contract — Page 4",
        "description": "Repossession, warranties, credit reporting, and servicing contacts.",
        "pages": [14],
    },
    {
        "id": "risc-page-5",
        "file": "retail-installment-contract-page-5.pdf",
        "title": "Retail installment contract — Page 5",
        "description": "Seller's right to cancel and arbitration provision.",
        "pages": [15],
    },
    {
        "id": "risc-page-6",
        "file": "retail-installment-contract-page-6.pdf",
        "title": "Retail installment contract — Page 6",
        "description": "Insurance notice, buyer acknowledgements, guaranty, and assignment.",
        "pages": [16],
    },
    {
        "id": "language-acknowledgement",
        "file": "language-acknowledgement.pdf",
        "title": "California language acknowledgement",
        "description": "Confirms the language in which the contract was negotiated.",
        "pages": [17],
    },
    {
        "id": "due-bill",
        "file": "due-bill.pdf",
        "title": "Due bill — work & accessories",
        "description": "Promised reconditioning, accessories, and as-is disclosures at time of sale.",
        "pages": [18],
    },
    {
        "id": "buyers-guide",
        "file": "buyers-guide.pdf",
        "title": "FTC Buyer's Guide (window form)",
        "description": "Federal used-vehicle warranty disclosure — front and back.",
        "pages": [19, 20],
    },
    {
        "id": "agreement-provide-insurance",
        "file": "agreement-provide-insurance.pdf",
        "title": "Agreement to provide insurance",
        "description": "Insurance requirements, coverage checkboxes, and loss payee block.",
        "pages": [21],
    },
    {
        "id": "pre-contract-disclosure",
        "file": "pre-contract-disclosure.pdf",
        "title": "Pre-contract disclosure (California)",
        "description": "Optional goods and services listed before you sign the installment contract.",
        "pages": [22],
    },
    {
        "id": "contract-cancellation-option",
        "file": "contract-cancellation-option.pdf",
        "title": "Contract cancellation option agreement",
        "description": "Two-day cancellation option for eligible used vehicle purchases under California law.",
        "pages": [23],
    },
]


def render_pages() -> None:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    prefix = TMP_DIR / "page"
    subprocess.run(
        [
            "pdftoppm",
            "-png",
            "-r",
            str(DPI),
            str(SOURCE_PDF),
            str(prefix),
        ],
        check=True,
    )


def redact_page(page_num: int, image_path: Path) -> Image.Image:
    img = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(img)
    w, h = img.size
    for box in PAGE_REDACTIONS.get(page_num, []):
        x1, y1, x2, y2 = box
        draw.rectangle([x1 * w, y1 * h, x2 * w, y2 * h], fill="white")
    return img


def save_pdf(images: list[Image.Image], out_path: Path) -> None:
    if len(images) == 1:
        images[0].save(out_path, "PDF", resolution=DPI)
        return
    images[0].save(
        out_path,
        "PDF",
        resolution=DPI,
        save_all=True,
        append_images=images[1:],
    )


def build_manifest(section_files: list[dict]) -> None:
    manifest = {
        "source": str(SOURCE_PDF.name),
        "note": "Customer and vehicle information redacted. Dealer form layouts preserved from actual deal paperwork.",
        "sections": section_files,
    }
    (OUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")


def main() -> int:
    if not SOURCE_PDF.exists():
        print(f"Missing source PDF: {SOURCE_PDF}", file=sys.stderr)
        return 1

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    render_pages()

    section_files = []
    for section in SECTIONS:
        images: list[Image.Image] = []
        for page_num in section["pages"]:
            image_path = TMP_DIR / f"page-{page_num:02d}.png"
            if not image_path.exists():
                print(f"Missing rendered page: {image_path}", file=sys.stderr)
                return 1
            images.append(redact_page(page_num, image_path))

        out_path = OUT_DIR / section["file"]
        save_pdf(images, out_path)
        section_files.append(
            {
                "id": section["id"],
                "file": section["file"],
                "title": section["title"],
                "description": section["description"],
                "pages": section["pages"],
            }
        )
        print(f"Wrote {out_path.name} ({len(section['pages'])} page(s))")

    build_manifest(section_files)

    # cleanup temp images
    for p in TMP_DIR.glob("page-*.png"):
        p.unlink()
    if TMP_DIR.exists() and not any(TMP_DIR.iterdir()):
        TMP_DIR.rmdir()

    print(f"Done — {len(section_files)} section PDFs in {OUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
