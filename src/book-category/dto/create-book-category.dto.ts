
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBookCategoryDto {
  @IsString()        // ต้องเป็นตัวหนังสือ
  @IsNotEmpty()      // ห้ามว่างเปล่า
  name: string;

  @IsString()        // ต้องเป็นตัวหนังสือ
  @IsOptional()      // จะมีหรือไม่ก็ได้ (ไม่บังคับ)
  description?: string;
}
