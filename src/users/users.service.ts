import { Injectable, OnModuleInit } from '@nestjs/common'; // เพิ่ม OnModuleInit
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // เพิ่ม import bcrypt

@Injectable()
export class UsersService implements OnModuleInit { // เพิ่ม implements OnModuleInit
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ✅ ส่วนที่ 1: สร้าง Admin อัตโนมัติถ้ายังไม่มี (Seeding)
  async onModuleInit() {
    const adminEmail = 'admin@bookstore.com';
    const admin = await this.userRepository.findOneBy({ email: adminEmail });
    
    if (!admin) {
      console.log('🚀 Seeding Admin User...');
      // สร้าง Admin โดยเรียกใช้ฟังก์ชัน create ของเราเอง (จะได้ถูก Hash รหัสผ่านด้วย)
      await this.create({
        email: adminEmail,
        password: 'adminpassword', // รหัสผ่านเริ่มต้น
        role: UserRole.ADMIN,      // กำหนดสิทธิ์เป็น Admin
      } as any); // cast as any เพื่อข้ามการเช็ค type ชั่วคราว (กรณี DTO ไม่มี field role)
      console.log('✅ Admin User created successfully!');
    }
  }

  // ✅ ส่วนที่ 2: สร้าง User ใหม่พร้อมเข้ารหัสรหัสผ่าน (Hashing)
  async create(createUserDto: CreateUserDto) {
    // 1. สร้าง Salt และ Hash รหัสผ่าน
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // 2. สร้าง Object User ใหม่โดยใช้รหัสที่ Hash แล้ว
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // 3. บันทึกลง Database
    return this.userRepository.save(user);
  }

  // ✅ เพิ่มฟังก์ชันค้นหาด้วย Email (จำเป็นสำหรับ Auth Module ในอนาคต)
  async findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  // (ส่วน update/remove เว้นไว้ก่อนได้ หรือใส่ตาม default)
  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}