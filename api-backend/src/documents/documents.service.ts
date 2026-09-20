import { BadRequestException, Injectable } from '@nestjs/common';
import 'multer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async findAllDocuments() {
    const documents = await this.documentRepository.find({
      order: { uploadDate: 'DESC' },
    });
    return documents.map((doc) => ({
      id: doc.id,
      title: doc.title,
      uploadDate: doc.uploadDate,
      action: `/documents/${doc.id}/download`,
    }));
  }

  validateFileFormat(file: Express.Multer.File): boolean {
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Formato de arquivo inválido. Apenas PDF, JPG e PNG são permitidos.',
      );
    }
    return true;
  }

  async uploadDocument(
    file: Express.Multer.File,
    title: string,
    description?: string,
  ): Promise<Document> {
    this.validateFileFormat(file);

    const safeFilename = path.basename(file.originalname);
    const uniqueFilename = `${Date.now()}-${safeFilename}`;

    const uploadDir = path.join(process.cwd(), 'uploads');
    const relativePath = `uploads/${uniqueFilename}`;
    const absolutePath = path.join(uploadDir, uniqueFilename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(absolutePath, file.buffer);

    const newDocument = this.documentRepository.create({
      title,
      description,
      filePath: relativePath,
    });

    return await this.documentRepository.save(newDocument);
  }

  async getDocumentFilePath(id: string): Promise<string> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new BadRequestException(
        'Documento não encontrado na base de dados.',
      );
    }

    const absolutePath = path.join(process.cwd(), document.filePath);
    if (!fs.existsSync(absolutePath)) {
      throw new BadRequestException(
        'O ficheiro físico não foi encontrado no servidor. Pode ter sido apagado.',
      );
    }

    return absolutePath;
  }
}
