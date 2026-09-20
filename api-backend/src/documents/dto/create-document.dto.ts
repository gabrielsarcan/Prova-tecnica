import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Título do documento',
    example: 'Relatório Financeiro',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Descrição opcional do documento',
    example: 'Relatório referente ao primeiro trimestre',
  })
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Arquivo a ser enviado (PDF, JPG, PNG)',
  })
  file: any;
}
