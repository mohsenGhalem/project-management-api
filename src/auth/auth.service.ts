import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      ...userData,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload: JwtPayload = { 
      sub: savedUser.id, 
      email: savedUser.email,
      role: savedUser.role 
    };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    const { password: _, ...userResponse } = savedUser;

    return {
      user: userResponse,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'name', 'role', 'avatar', 'isOnline', 'department']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last seen and online status
    await this.userRepository.update(user.id, { 
      isOnline: true, 
      lastSeen: new Date() 
    });

    // Generate JWT token
    const payload: JwtPayload = { 
      sub: user.id, 
      email: user.email,
      role: user.role 
    };
    const token = this.jwtService.sign(payload);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    return {
      user: userResponse,
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'name', 'role', 'avatar', 'isOnline', 'department']
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['ownedProjects', 'teams', 'assignedTasks']
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.userRepository.update(userId, { 
      isOnline: false, 
      lastSeen: new Date() 
    });

    return { message: 'Logged out successfully' };
  }

  async changePassword(
    userId: string, 
    currentPassword: string, 
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'password']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await this.userRepository.update(userId, { password: hashedNewPassword });

    return { message: 'Password changed successfully' };
  }

  async refreshToken(user: User): Promise<{ token: string }> {
    const payload: JwtPayload = { 
      sub: user.id, 
      email: user.email,
      role: user.role 
    };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}