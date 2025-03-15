import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { UserDto } from '../src/user/dto';
import { BookmarkDto, UpdateBookmarkDto } from '../src/bookmark/dto';

describe('app e2e', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3000);
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: `test${crypto.randomUUID()}@gmail.com`,
      hash: '123',
    };
    describe('Sign Up', () => {
      it('should SignUp', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Sign In', () => {
      it('should Sign In', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userToken', 'token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: `Bearer $S{userToken}` })
          .stores('userId', 'id')
          .expectStatus(200);
      });
    });

    describe('Edit User', () => {
      it('should update User', () => {
        const dto: UserDto = {
          firstName: 'updated FirstName',
          lastName: 'updated LastName',
        };
        return pactum
          .spec()
          .patch('/users/update/$S{userId}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get Empty Bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200);
      });
    });
    describe('create bookmark', () => {
      const dto: BookmarkDto = {
        title: 'test title',
        link: 'https://google.com',
        description: 'test description',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody({ userId: '$S{userId}', ...dto })
          .stores('bookmarkId', 'id')
          .expectStatus(201);
      });
    });
    describe('Get Bookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmark')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200);
      });
    });

    describe('Get Bookmarks By Id', () => {
      it('should get bookmark by ID', () => {
        return pactum
          .spec()
          .get('/bookmark/$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(200);
      });
    });

    describe('Edit Bookmark By Id', () => {
      it('should update the bookmark by id', () => {
        const dto: UpdateBookmarkDto = {
          title: 'updated title',
          link: 'https://google.com',
          description: 'updated description',
        };

        return pactum
          .spec()
          .patch('/bookmark/$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .withBody(dto)
          .expectStatus(200);
      });
    });

    describe('Delete Bookmark By Id', () => {
      it('should delete the Bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmark/$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userToken}' })
          .expectStatus(204);
      });
    });
  });
});
