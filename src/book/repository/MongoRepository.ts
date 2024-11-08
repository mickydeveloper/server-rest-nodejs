import { Injectable, NotFoundException } from '@nestjs/common';
import { BookResponseDto } from '../dto/book-response.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { Repository } from './Repository';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from '../book.schema';
import * as mongoose from 'mongoose';
import { ParsedUrlQuery } from 'node:querystring';
import { PageMetaDto, PaginatedDto } from '../dto/paginated.dto';

@Injectable()
export class MongoRespository implements Repository {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: mongoose.Model<Book>,
  ) {}

  private convert(book: BookDocument): BookResponseDto {
    const json = book.toObject({ versionKey: false });
    const id = json._id;
    delete json._id;
    return {
      ...json,
      id: String(id),
    };
  }

  async create(createBookDto: CreateBookDto): Promise<BookResponseDto> {
    const res = await this.bookModel.create(createBookDto);
    return this.convert(res);
  }

  async findOne(id: string): Promise<BookResponseDto> {
    const book = await this.bookModel.findOne({ _id: id }).exec();

    if (!book) {
      throw new NotFoundException('book not found');
    }

    return this.convert(book);
  }
  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginatedDto<BookResponseDto>> {
    const books = await this.bookModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    const itemCount = await this.bookModel.countDocuments();
    return new PaginatedDto(books.map(this.convert), page, limit, itemCount);
  }

  async delete(id: string): Promise<void> {
    const res = await this.bookModel.deleteOne({ id: id }).exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException('book not found');
    }
  }
}
