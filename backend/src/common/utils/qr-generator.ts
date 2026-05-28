// Location: backend/src/common/utils/qr-generator.ts

import * as QRCode from 'qrcode';

/**
 * Generate QR code as Base64 image
 */
export async function generateQRCode(
  data: string,
): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
    });

    return qrDataUrl;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `QR generation failed: ${error.message}`,
      );
    }

    throw new Error('QR generation failed');
  }
}
