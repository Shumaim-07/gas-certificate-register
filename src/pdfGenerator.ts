import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { CertificateData } from "./types";
import { fieldPositions, appliancePositions } from "./fieldConfig";
import { inspectionTickPositions } from "./fieldConfig";

const TEMPLATE_URL = "/GAS Certificate Template.pdf";

async function loadTemplate(): Promise<ArrayBuffer> {
  const response = await fetch(TEMPLATE_URL);
  if (!response.ok) {
    throw new Error("Failed to load certificate template");
  }
  return response.arrayBuffer();
}

function formatDate(value: string): string {
  if (!value) return "";
  const date = new Date(value + "T00:00:00");
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getFieldValue(
  data: CertificateData,
  key: keyof CertificateData,
): string {
  const value = data[key];
  if (!value) return "";

  if (key === "applianceCount") {
    return value.toString();
  }

  if (
    key === "issueDate" ||
    key === "expiryDate" ||
    key === "nextInspectionDate"
  ) {
    return formatDate(String(value));
  }

  return value as string;
}

export async function generateCertificatePdf(
  data: CertificateData,
): Promise<Uint8Array> {
  const templateBytes = await loadTemplate();

  const pdfDoc = await PDFDocument.load(templateBytes);

  const page = pdfDoc.getPages()[0];

  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  function drawTick(x: number, y: number) {
    page.drawLine({
      start: { x, y },
      end: { x: x + 4, y: y - 6 },
      thickness: 1.5,
    });

    page.drawLine({
      start: { x: x + 4, y: y - 6 },
      end: { x: x + 10, y: y + 2 },
      thickness: 1.5,
    });
  }

  for (const field of fieldPositions) {
    if (field.key === 'engineerSignature' || field.key === 'receiverSignature') continue;
    const text = getFieldValue(data, field.key);
    if (!text) continue;

    const fontSize = field.fontSize ?? 9;

    const x = (field.x / 100) * width;
    const y = height - (field.y / 100) * height - fontSize;

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
      maxWidth: (field.width / 100) * width,
      lineHeight: fontSize + 2,
    });
  }

  Object.entries(inspectionTickPositions).forEach(([key, positions]) => {
    const value = (data as any)[key];
    if (!value) return;

    const pos = positions[value as "PASS" | "FAIL" | "NA"];
    if (!pos) return;

    const x = (pos.x / 100) * width;
    const y = height - (pos.y / 100) * height;

    drawTick(x, y);
  });

  data.appliances.forEach((appliance, index) => {
    const pos = appliancePositions[index];
    if (!pos) return;

    const drawField = (
      text: string,
      field: { x: number; y: number; width?: number; fontSize?: number },
    ) => {
      if (!text) return;

      const fontSize = field.fontSize ?? 8;

      const x = (field.x / 100) * width;
      const y = height - (field.y / 100) * height - fontSize;

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: field.width ? (field.width / 100) * width : undefined,
      });
    };

    drawField(appliance.location || "", pos.location);
    drawField(appliance.type || "", pos.type);
    drawField(appliance.manufacturer || "", pos.manufacturer);
    drawField(appliance.model || "", pos.model);
    drawField(appliance.serialNumber || "", pos.serialNumber);
    drawField(appliance.ownedBy || "", pos.ownedBy);
    drawField(appliance.inspected || "", pos.inspected);
    drawField(appliance.flueType || "", pos.flueType);

    drawField(appliance.operatingPressure || "", pos.operatingPressure);
    drawField(appliance.safetyDevice || "", pos.safetyDevice);
    drawField(appliance.ventilation || "", pos.ventilation);
    drawField(appliance.visualFlueCondition || "", pos.visualFlueCondition);
    drawField(appliance.flueOperationChecks || "", pos.flueOperationChecks);
    drawField(appliance.combustionReading || "", pos.combustionReading);
    drawField(appliance.applianceServiced || "", pos.applianceServiced);
    drawField(appliance.coAlarmFitted || "", pos.coAlarmFitted);
    drawField(appliance.coAlarmTested || "", pos.coAlarmTested);
    drawField(appliance.safeToUse || "", pos.safeToUse);
    drawField(appliance.safetyDefect || "", pos.safetyDefect);
    drawField(appliance.giuspClassification || "", pos.giuspClassification);
    drawField(appliance.warningRecordSerial || "", pos.warningRecordSerial);
    drawField(appliance.remedialAction || "", pos.remedialAction);
    drawField(appliance.workDetails || "", pos.workDetails);
  });

  if (data.engineerSignature) {
    try {
      const sigConfig = fieldPositions.find((f) => f.key === "engineerSignature");
      const sigXPercent = sigConfig?.x ?? 67;
      const sigYPercent = sigConfig?.y ?? 84.3;
      const sigWidthPercent = sigConfig?.width ?? 12;

      const dataUrl = data.engineerSignature;
      const mimeType = dataUrl.split(";")[0].split(":")[1];
      const base64 = dataUrl.split(",")[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const sigImage =
        mimeType === "image/jpeg" || mimeType === "image/jpg"
          ? await pdfDoc.embedJpg(bytes)
          : await pdfDoc.embedPng(bytes);

      const sigWidth = (sigWidthPercent / 165) * width;
      const sigHeight = sigImage.height * (sigWidth / sigImage.width);
      const sigX = (sigXPercent / 100) * width;
      const sigY = height - (sigYPercent / 100) * height - sigHeight;

      page.drawImage(sigImage, {
        x: sigX,
        y: sigY,
        width: sigWidth,
        height: sigHeight,
      });
    } catch (error) {
      console.error("Failed to embed engineer signature:", error);
    }
  }

  if (data.receiverSignature) {
    const recConfig = fieldPositions.find((f) => f.key === "receiverSignature");
    const recXPercent = recConfig?.x ?? 60;
    const recYPercent = recConfig?.y ?? 91;
    const recWidthPercent = recConfig?.width ?? 12;
    const recFontSize = recConfig?.fontSize ?? 9;

    if (data.receiverSignature === "ONLINE") {
      try {
        const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
        const recX = (recXPercent / 100) * width;
        const recY = height - (recYPercent / 100) * height - recFontSize;
        page.drawText("ONLINE", {
          x: recX,
          y: recY,
          size: recFontSize,
          font: italicFont,
          color: rgb(0, 0, 0),
        });
      } catch (error) {
        console.error("Failed to draw ONLINE text:", error);
      }
    } else {
      try {
        const dataUrl = data.receiverSignature;
        const mimeType = dataUrl.split(";")[0].split(":")[1];
        const base64 = dataUrl.split(",")[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        const recImage =
          mimeType === "image/jpeg" || mimeType === "image/jpg"
            ? await pdfDoc.embedJpg(bytes)
            : await pdfDoc.embedPng(bytes);

        const recWidth = (recWidthPercent / 240) * width;
        const recHeight = recImage.height * (recWidth / recImage.width);
        const recX = (recXPercent / 100) * width;
        const recY = height - (recYPercent / 100) * height - recHeight;

        page.drawImage(recImage, {
          x: recX,
          y: recY,
          width: recWidth,
          height: recHeight,
        });
      } catch (error) {
        console.error("Failed to embed receiver signature:", error);
      }
    }
  }

  return pdfDoc.save() as Promise<Uint8Array>;
}

/* =========================
   PRINT
========================= */
export async function printCertificatePdf(
  data: CertificateData,
): Promise<void> {
  const pdfBytes = await generateCertificatePdf(data);

  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });

  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url, "_blank");

  if (printWindow) {
    printWindow.addEventListener("load", () => {
      printWindow.focus();
      printWindow.print();
    });
  }

  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function generateFileName(data: CertificateData): string {
  const address = (data.siteHouseAddress || "").toUpperCase();

  // door number
  const doorNumberMatch = address.match(/^\d+/);
  const doorNumber = doorNumberMatch ? doorNumberMatch[0] : "000";

  // postcode
  const postcodeMatch = address.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);

  const postcode = postcodeMatch
    ? postcodeMatch[0].replace(/\s/g, "")
    : "UNKNOWN";

  // date (DDMMYYYY)
  const d = new Date(data.issueDate);
  const ddmmyyyy =
    String(d.getDate()).padStart(2, "0") +
    String(d.getMonth() + 1).padStart(2, "0") +
    d.getFullYear();

  return `GAS-${doorNumber}-${postcode}-${ddmmyyyy}.pdf`;
}
/* =========================
   DOWNLOAD (FIXED FILENAME)
========================= */
export async function downloadCertificatePdf(
  data: CertificateData,
): Promise<void> {
  const pdfBytes = await generateCertificatePdf(data);

  const blob = new Blob([new Uint8Array(pdfBytes)], {
    type: "application/pdf",
  });
  const url = URL.createObjectURL(blob);

  // download with correct name
  const a = document.createElement("a");
  a.href = url;
  a.download = generateFileName(data);
  a.click();

  // then open print (same blob)
  setTimeout(() => {
    const w = window.open(url);
    w?.print();
  }, 500);
}
