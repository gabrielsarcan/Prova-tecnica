import { BadRequestException, Injectable } from '@nestjs/common';
import 'multer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class DocumentUploadService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  // A validação que criamos para o teste passar (GREEN)
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

    // Segurança: Prevenção de Path Traversal
    // O path.basename garante que pegaremos estritamente o nome do arquivo, removendo rotas maliciosas
    const safeFilename = path.basename(file.originalname);
    const uniqueFilename = `${Date.now()}-${safeFilename}`;

    const uploadDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, uniqueFilename);

    // Grava o arquivo localmente
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(filePath, file.buffer);

    // Persiste no Banco de Dados
    const newDocument = this.documentRepository.create({
      title,
      description,
      filePath,
    });

    return await this.documentRepository.save(newDocument);
  }
}
