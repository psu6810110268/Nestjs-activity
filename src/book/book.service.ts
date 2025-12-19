import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}
  create(createBookDto: CreateBookDto) {
    return this.bookRepository.save(createBookDto);
  }

  findAll() {
    return this.bookRepository.find({ relations: ['category'] });
  }

  async findOne(id: string) {
    const book =  await this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!book) throw new NotFoundException();
    return book;
  }

  async incrementLikes(id: string) {
    const book = await this.findOne(id);
    book.likeCount += 1;
    return this.bookRepository.save(book);
 }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.bookRepository.update(id, updateBookDto);
  }

  remove(id: string) {
    return this.bookRepository.delete(id);
  }

  async toggleLike(bookId: string, userId: string) {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
      relations: ['likedBy'], // ดึงคนกดไลก์มาด้วย
    });

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    // เช็คว่าเคยไลก์หรือยัง
    const userIndex = book.likedBy.findIndex((u) => u.id === userId);

    if (userIndex !== -1) {
      // ถ้าเคย -> เอาออก (Unlike)
      book.likedBy.splice(userIndex, 1);
    } else {
      // ถ้าไม่เคย -> ใส่เพิ่ม (Like)
      const user = { id: userId } as User;
      book.likedBy.push(user);
    }

    await this.bookRepository.save(book);

    return {
      message: userIndex !== -1 ? 'Un-liked' : 'Liked',
      currentLikes: book.likedBy.length,
    };
  }
}
