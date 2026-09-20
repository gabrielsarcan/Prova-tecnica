import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Texto do comentário',
    example: 'Este documento precisa de revisão na página 2.',
  })
  text: string;
}
