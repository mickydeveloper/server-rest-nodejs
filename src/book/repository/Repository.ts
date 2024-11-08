import { Book } from '../book.schema';
import { BookResponseDto } from '../dto/book-response.dto';
import { CreateBookDto } from '../dto/create-book.dto';
import { PaginatedDto } from '../dto/paginated.dto';

export interface Repository {
  create(createBookDto: CreateBookDto): Promise<BookResponseDto>;
  findOne(id: string): Promise<BookResponseDto>;
  findAll(page: number, limit: number): Promise<PaginatedDto<BookResponseDto>>;
  delete(id: string): Promise<void>;
}
