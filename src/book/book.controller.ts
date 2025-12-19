import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from '@nestjs/passport'; // 1. Guard ของ Passport (เช็ค Login)
import { RolesGuard } from '../auth/roles.guard'; // 2. Guard ที่เราสร้างเอง (เช็ค Role)
import { Roles } from '../auth/roles.decorator'; // 3. Decorator ที่เราสร้างเอง
import { UserRole } from '../users/entities/user.entity'; // 4. Enum Role

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // ✅ Public Route: ใครก็เข้าได้ ไม่ต้องล็อก
  @Get()
  findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  // 🔒 Protected Route: ต้อง Login + ต้องเป็น ADMIN เท่านั้น
  @UseGuards(AuthGuard('jwt'), RolesGuard) // ใช้ยาม 2 คน: เช็ค Token และ เช็ค Role
  @Roles(UserRole.ADMIN) // แปะป้ายว่า "เฉพาะ ADMIN"
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  // 🔒 Protected Route
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  // 🔒 Protected Route
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}