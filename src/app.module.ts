import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookCategoryModule } from './book-category/book-category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      // 1. แก้ User/Pass ให้ตรงกับ Docker (ที่คุณส่งมาตอนแรก)
      username: 'postgres',       
      password: 'postgres', 
      
      // 2. แก้ชื่อ DB ให้เป็น _ (ขีดล่าง) ตาม Docker
      database: 'bookstore-dev', 

      // 3. แก้ให้โหลด Entity อัตโนมัติ (แก้ Error: EntityMetadataNotFoundError)
      entities: [], 
      autoLoadEntities: true,  // <-- สำคัญมาก! ต้องเพิ่มบรรทัดนี้
      
      synchronize: true, 
    }),
    BookCategoryModule,
  ],
})
export class AppModule {}