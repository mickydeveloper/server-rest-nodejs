import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import * as mongoose from 'mongoose';
import { ParsedUrlQuery } from 'node:querystring';
import { MongoRespository } from './repository/MongoRepository';
import { BookResponseDto } from './dto/book-response.dto';
import { PaginatedDto } from './dto/paginated.dto';

@Injectable()
export class BookService {
  constructor(private readonly respository: MongoRespository) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedDto<BookResponseDto>> {
    return await this.respository.findAll(page, limit);
  }

  async create(book: BookResponseDto): Promise<BookResponseDto> {
    const res = await this.respository.create(book);
    return res;
  }

  async findOne(id: string): Promise<BookResponseDto> {
    const book = await this.respository.findOne(id);
    return book;
  }

  async delete(id: string): Promise<void> {
    await this.respository.delete(id);
  }
}
