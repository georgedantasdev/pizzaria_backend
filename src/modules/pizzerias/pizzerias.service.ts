import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Prisma, Role, Pizzeria } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { PizzeriasRepository } from './repository/pizzerias.repository';
import { CreatePizzeriaDto } from './dto/create-pizzeria.dto';
import { UpdatePizzeriaDto } from './dto/update-pizzeria.dto';

@Injectable()
export class PizzeriasService {
  constructor(
    private readonly repository: PizzeriasRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreatePizzeriaDto) {
    const documentExists = await this.repository.findByDocument(dto.document);
    if (documentExists) throw new ConflictException('CNPJ já cadastrado');

    const emailExists = await this.prisma.user.findFirst({
      where: { email: dto.admin.email },
    });
    if (emailExists) throw new ConflictException('E-mail do admin já cadastrado');

    const hashedPassword = await bcrypt.hash(dto.admin.password, 10);

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const pizzeria = await tx.pizzeria.create({
        data: { name: dto.name, document: dto.document },
      });

      const admin = await tx.user.create({
        data: {
          name: dto.admin.name,
          email: dto.admin.email,
          password: hashedPassword,
          role: Role.ADMIN,
          pizzeriaId: pizzeria.id,
        },
        select: { id: true, name: true, email: true, role: true },
      });

      return { ...pizzeria, admin };
    });
  }

  async findAll(): Promise<Pizzeria[]> {
    return this.repository.findAll();
  }

  async findOne(id: string): Promise<Pizzeria> {
    const pizzeria = await this.repository.findById(id);

    if (!pizzeria) {
      throw new NotFoundException('Pizzaria não encontrada');
    }

    return pizzeria;
  }

  async update(id: string, dto: UpdatePizzeriaDto): Promise<Pizzeria> {
    const pizzeria = await this.repository.findById(id);

    if (!pizzeria) {
      throw new NotFoundException('Pizzaria não encontrada');
    }

    return this.repository.update(id, dto);
  }

  async remove(id: string): Promise<void> {
    const pizzeria = await this.repository.findById(id);

    if (!pizzeria) {
      throw new NotFoundException('Pizzaria não encontrada');
    }

    await this.repository.softDelete(id);
  }
}
