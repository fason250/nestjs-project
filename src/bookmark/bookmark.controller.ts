import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { BookmarkDto, UpdateBookmarkDto } from './dto';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtAuthGuard)
@Controller('bookmark')
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Get()
  getAllBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getAllBookmarks(userId);
  }

  @Post()
  createBookmark(@GetUser('id') userId: number, @Body() dto: BookmarkDto) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Get(':bookmarkId')
  getBookmarkById(
    @GetUser('id') userId: number,
    @Param('bookmarkId') bookmarkId: string,
  ) {
    return this.bookmarkService.getBookmarkById(userId, +bookmarkId);
  }

  @Patch(':bookmarkId')
  updateBookmarkById(
    @GetUser('id') userId: number,
    @Param('bookmarkId') bookmarkId: string,
    @Body() dto: UpdateBookmarkDto,
  ) {
    return this.bookmarkService.updateBookmarkById(userId, +bookmarkId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':bookmarkId')
  deleteBookmarkById(
    @GetUser('id') userId: number,
    @Param('bookmarkId') bookmarkId: string,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, +bookmarkId);
  }
}
