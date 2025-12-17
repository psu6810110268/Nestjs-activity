import { Injectable, OnModuleInit } from '@nestjs/common'; // 1. เพิ่ม OnModuleInit
import { InjectRepository } from '@nestjs/typeorm'; // 2. เพิ่มตัว Inject
import { Repository } from 'typeorm'; // 3. เพิ่ม Repository
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { BookCategory } from './entities/book-category.entity';

@Injectable()
export class BookCategoryService {
  create(createBookCategoryDto: CreateBookCategoryDto) {
    return 'This action adds a new bookCategory';
  }

  constructor(
    @InjectRepository(BookCategory)
    private repo: Repository<BookCategory>,
  ) {}

  findAll() {
   return this.repo.find(); // <--- สั่งให้ค้นหาข้อมูลทั้งหมดในตารางส่งกลับไป
 }

  findOne(id: number) {
    return `This action returns a #${id} bookCategory`;
  }

  update(id: number, updateBookCategoryDto: UpdateBookCategoryDto) {
    return `This action updates a #${id} bookCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} bookCategory`;
  }

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
}
