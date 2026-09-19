import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class DocumentUploadService {
  validateFileFormat(file: Express.Multer.File): boolean {
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato de arquivo inválido. Apenas PDF, JPG e PNG são permitidos.',
      );
    }

    return true;
  }
}
