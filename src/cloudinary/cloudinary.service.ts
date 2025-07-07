import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as bufferToStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinaryInstance: typeof cloudinary,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        {
          folder: folder || 'pictures',
          overwrite: true,
          eager_async: true,
          use_filename: false,
          unique_filename: true,
        },
        (error, result) => {
          if (error) return reject(error);
          result
            ? resolve(result)
            : reject(new Error('Upload result is undefined'));
        },
      );

      bufferToStream(file.buffer).pipe(uploadStream);
    });
  }
  async deleteImage(publicId: string) {
    return this.cloudinaryInstance.uploader.destroy(publicId);
  }
  async deleteFolder(folder: string): Promise<any> {
    try {
      await this.cloudinaryInstance.api.delete_resources_by_prefix(folder);
      return await this.cloudinaryInstance.api.delete_folder(folder);
    } catch (error) {
      throw new Error(`فشل حذف المجلد: ${error.message}`);
    }
  }
}
