import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { createReadStream } from "streamifier";

type UploadCallback = (url: string) => void;

class CloudinaryFacade {
  constructor() {
    cloudinary.config({
      cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
      api_key: `${process.env.CLOUDINARY_API_KEY}`,
      api_secret: `${process.env.CLOUDINARY_API_SECRET}`
    });
  }

  async uploadBuffer(folder: string, buffer: Buffer, callback: UploadCallback) {
    let cld_upload_stream = cloudinary.uploader.upload_stream({ folder: folder },
      (error: Error | undefined, result: UploadApiResponse | undefined) => {
        if (error) {
          console.log("[uploadBufferError]");
          console.log(error);
        } else if (result) {
          callback(result.secure_url);
        }
      }
    );
  
    createReadStream(buffer).pipe(cld_upload_stream);
  }
}

export default CloudinaryFacade;
