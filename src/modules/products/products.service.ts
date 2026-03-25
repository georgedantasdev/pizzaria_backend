import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './repository/products.repository';

@Injectable()
export class ProductsService {
  constructor(private repository: ProductsRepository) {}

  private mapProduct({ pizzeriaId: _pizzeriaId, ...product }: NonNullable<Awaited<ReturnType<ProductsRepository['findById']>>>) {
    return product;
  }

  async create(dto: CreateProductDto, currentUser: User) {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas ADMIN pode cadastrar produtos');
    }

    if (!currentUser.pizzeriaId) {
      throw new ForbiddenException('Usuário não pertence a nenhuma pizzaria');
    }

    const product = await this.repository.create(dto, currentUser.pizzeriaId);

    return {
      message: 'Produto criado com sucesso',
      data: this.mapProduct(product),
    };
  }

  async findAll(currentUser: User) {
    if (!currentUser.pizzeriaId) {
      throw new ForbiddenException('Usuário não pertence a nenhuma pizzaria');
    }

    const products = await this.repository.findAllByPizzeria(currentUser.pizzeriaId);

    return {
      message: 'Produtos listados com sucesso',
      data: products.map((p) => this.mapProduct(p)),
    };
  }

  async findOne(id: string, currentUser: User) {
    if (!currentUser.pizzeriaId) {
      throw new ForbiddenException('Usuário não pertence a nenhuma pizzaria');
    }

    const product = await this.repository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.pizzeriaId !== currentUser.pizzeriaId) {
      throw new ForbiddenException('Produto não pertence à sua pizzaria');
    }

    return {
      message: 'Produto encontrado com sucesso',
      data: this.mapProduct(product),
    };
  }

  async update(id: string, dto: UpdateProductDto, currentUser: User) {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas ADMIN pode atualizar produtos');
    }

    const product = await this.repository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.pizzeriaId !== currentUser.pizzeriaId) {
      throw new ForbiddenException('Produto não pertence à sua pizzaria');
    }

    const updated = await this.repository.update(id, dto);

    return {
      message: 'Produto atualizado com sucesso',
      data: this.mapProduct(updated),
    };
  }

  async remove(id: string, currentUser: User) {
    if (currentUser.role !== Role.ADMIN) {
      throw new ForbiddenException('Apenas ADMIN pode deletar produtos');
    }

    const product = await this.repository.findById(id);

    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (product.pizzeriaId !== currentUser.pizzeriaId) {
      throw new ForbiddenException('Produto não pertence à sua pizzaria');
    }

    await this.repository.softDelete(id);

    return { message: 'Produto removido com sucesso' };
  }
}