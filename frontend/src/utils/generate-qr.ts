// FILE: src/utils/generate-qr.ts

export function downloadQRCode(dataUrl: string, filename = "ticket-qr.png"): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function isValidQRCode(qrCode: string): boolean {
  return (
    typeof qrCode === "string" && qrCode.startsWith("data:image/png;base64,")
  );
}