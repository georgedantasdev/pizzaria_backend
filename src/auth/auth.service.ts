import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private repository: AuthRepository,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.repository.findByEmail(dto.email);

    if (userExists) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.repository.createUser({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.repository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const token = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return { token };
  }
}