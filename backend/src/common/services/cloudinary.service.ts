import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  /**
   * Upload image to Cloudinary
   */
  async uploadImage(
    buffer: Buffer,
    folder = 'events',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
          },
          (error, result) => {
            // Upload failed
            if (error) {
              this.logger.error(
                'Cloudinary upload failed',
                error,
              );

              return reject(
                error instanceof Error
                  ? error
                  : new Error('Cloudinary upload failed'),
              );
            }

            // No result returned
            if (!result) {
              return reject(
                new Error('No upload result returned'),
              );
            }

            // Success
            resolve(result.secure_url);
          },
        )
        .end(buffer);
    });
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}