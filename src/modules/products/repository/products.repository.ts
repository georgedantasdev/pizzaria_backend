import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductsRepository {
  constructor(private prisma: PrismaService) {}

  private readonly productSelect = {
    id: true,
    name: true,
    description: true,
    imageUrl: true,
    available: true,
    pizzeriaId: true,
    createdAt: true,
    updatedAt: true,
    sizes: {
      select: {
        id: true,
        name: true,
        price: true,
      },
    },
    flavors: {
      select: {
        id: true,
        name: true,
      },
    },
  } as const;

  async findById(id: string) {
    return this.prisma.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: this.productSelect,
    });
  }

  async findAllByPizzeria(pizzeriaId: string) {
    return this.prisma.product.findMany({
      where: {
        pizzeriaId,
        deletedAt: null,
      },
      select: this.productSelect,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateProductDto, pizzeriaId: string) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        pizzeriaId,
        sizes: {
          create: dto.sizes.map((size) => ({
            name: size.name,
            price: size.price,
          })),
        },
        flavors: {
          create: dto.flavors.map((flavor) => ({
            name: flavor.name,
          })),
        },
      },
      select: this.productSelect,
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        available: dto.available,
      },
      select: this.productSelect,
    });
  }

  async softDelete(id: string): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
