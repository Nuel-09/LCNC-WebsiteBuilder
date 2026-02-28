import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Register a new user.
   * Steps:
   * 1) Validate duplicate email
   * 2) Hash password with bcrypt
   * 3) Save user in database
   * 4) Sign and return JWT + safe user profile
   */
  async signup(signupDto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: signupDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const passwordHash = await bcrypt.hash(signupDto.password, 12);

    const newUser = await this.prisma.user.create({
      data: {
        email: signupDto.email,
        passwordHash,
        fullName: signupDto.fullName,
        schoolName: signupDto.schoolName,
      },
    });

    // JWT payload uses common claims:
    // sub => user id, email => quick identity reference.
    const token = await this.jwtService.signAsync({
      sub: newUser.id,
      email: newUser.email,
    });

    return {
      token,
      user: this.toSafeUser(newUser),
    };
  }

  /**
   * Log user in by validating credentials from database.
   */
  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      token,
      user: this.toSafeUser(user),
    };
  }

  /**
   * Remove sensitive fields before returning user object to client.
   */
  private toSafeUser(user: {
    id: string;
    email: string;
    fullName: string | null;
    schoolName: string | null;
  }) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      schoolName: user.schoolName,
    };
  }
}
