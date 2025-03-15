import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { BookmarkDto, UpdateBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private readonly databaseService: DatabaseService) {}
  async getAllBookmarks(userId: number) {
    return await this.databaseService.bookmark.findMany({ where: { userId } });
  }
  async createBookmark(userId: number, dto: BookmarkDto) {
    return await this.databaseService.bookmark.create({
      data: { userId, ...dto },
    });
  }
  async getBookmarkById(userId: number, bookmarkId: number) {
    return await this.databaseService.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });
  }
  async updateBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: UpdateBookmarkDto,
  ) {
    //find the bookmark by id
    const bookmark = await this.databaseService.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });
    if (!bookmark) throw new Error('bookmark not found');

    return await this.databaseService.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });
  }
  async deleteBookmarkById(userId: number, bookmarkId: number) {
    return await this.databaseService.bookmark.deleteMany({
      where: { userId, id: bookmarkId },
    });
  }
}
