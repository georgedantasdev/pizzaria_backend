import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BootstrapService implements OnModuleInit {
  private readonly logger = new Logger(BootstrapService.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.createAdmin();
  }

  private async createAdmin() {
    const adminExists = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (adminExists) {
      this.logger.log('Admin já existe, seed ignorado.');
      return;
    }

    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error(
        'Variáveis ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD não definidas no .env',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    this.logger.log('Admin criado com sucesso!');
  }
}