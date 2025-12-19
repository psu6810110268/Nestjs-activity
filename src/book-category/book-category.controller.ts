import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookCategoryService } from './book-category.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';

// 👇 1. อย่าลืม Import ของพวกนี้มาด้วยครับ (สำคัญมาก)
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('book-category')
export class BookCategoryController {
  constructor(private readonly bookCategoryService: BookCategoryService) {}

  // ✅ Public: ลูกค้าดูหมวดหมู่ได้
  @Get()
  findAll() {
    return this.bookCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookCategoryService.findOne(id);
  }

  // 🔒 Protected: แอดมินเท่านั้นที่ สร้าง/แก้ไข/ลบ ได้
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createBookCategoryDto: CreateBookCategoryDto) {
    return this.bookCategoryService.create(createBookCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookCategoryDto: UpdateBookCategoryDto) {
    return this.bookCategoryService.update(id, updateBookCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookCategoryService.remove(id);
  }
}