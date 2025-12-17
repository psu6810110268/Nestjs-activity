// src/book-category/book-category.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { BookCategory } from './entities/book-category.entity';

@Injectable()
export class BookCategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(BookCategory)
    private readonly repo: Repository<BookCategory>,
  ) {}

  // ฟังก์ชัน Seeding ข้อมูลที่คุณต้องการ
  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
        console.log('Seeding Book Categories...');
        await this.repo.save([
           { name: 'Fiction', description: 'Stories and novels' },
           { name: 'Technology', description: 'Computers and engineering' },
           { name: 'History', description: 'Past events' }
        ]);
    }
  }

  // CRUD Methods ที่ Controller เรียกใช้
  create(createBookCategoryDto: CreateBookCategoryDto) {
    return this.repo.save(createBookCategoryDto);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  update(id: number, updateBookCategoryDto: UpdateBookCategoryDto) {
    return this.repo.update(id, updateBookCategoryDto);
  }

  remove(id: number) {
    return this.repo.delete(id);
  }
}