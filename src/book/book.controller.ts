import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ParsedUrlQuery } from 'node:querystring';
import { BookResponseDto } from './dto/book-response.dto';
import { PaginatedDto } from './dto/paginated.dto';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  async findAll(
    @Query('page') page,
    @Query('limit') limit,
  ): Promise<PaginatedDto<BookResponseDto>> {
    return this.bookService.findAll(page, limit);
  }

  @Post()
  async createBook(
    @Body()
    book: BookResponseDto,
  ): Promise<Book> {
    return this.bookService.create(book);
  }

  @Get(':id')
  async getBook(
    @Param('id')
    id: string,
  ): Promise<Book> {
    return this.bookService.findOne(id);
  }

  // @Put(':id')
  // async updateBook(
  //   @Param('id')
  //   id: string,
  //   @Body()
  //   book: UpdateBookDto,
  // ): Promise<Book> {
  //   return this.bookService.updateById(id, book);
  // }

  @Delete(':id')
  async deleteBook(
    @Param('id')
    id: string,
  ): Promise<void> {
    return this.bookService.delete(id);
  }
}
