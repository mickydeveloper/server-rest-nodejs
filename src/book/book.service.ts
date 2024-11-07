import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './book.schema';
import * as mongoose from 'mongoose';
import { ParsedUrlQuery } from 'node:querystring';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAll(query: ParsedUrlQuery): Promise<Array<Book>> {
    const resPerPage = Number(query.resPerPage) || 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          title: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return books;
  }

  async create(book: Book): Promise<Book> {
    const res = await this.bookModel.create(book);
    return res;
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id);

    if (!book) {
      throw new NotFoundException('book not found');
    }

    return book;
  }

  async updateById(id: string, book: Book): Promise<Book> {
    const res = await this.bookModel.findByIdAndUpdate(id, book, {
      new: true,
      runValidators: true,
    });
    return res;
  }

  async deleteById(id: string): Promise<Book> {
    const res = await this.bookModel.findByIdAndDelete(id);
    return res;
  }
}