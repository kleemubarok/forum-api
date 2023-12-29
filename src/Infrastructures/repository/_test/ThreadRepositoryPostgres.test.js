const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123'; // stub!

  describe('addThread function', () => {
    it('should persist added thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new AddThread({
        userID: 'user-123',
        title: 'Thread Titile',
        body: 'thread body',
      });
      const thredRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await thredRepository.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: newThread.userID,
      }));
      
      const validateThread = await thredRepository.validateID('thread-123');
      expect(validateThread).toBeTruthy();     

      const thread = await thredRepository.getThreadById('thread-123');
      const uname = await UsersTableTestHelper.findUsersById(newThread.userID);
      expect(thread.username).toEqual(uname[0].username);
      expect(thread.title).toEqual(newThread.title);
      expect(thread.body).toEqual(newThread.body);
    });
  });

  describe('validateID', () => {
    //Arrange
    const threadRepo = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

    it('should throw NotFoundError when threadID not found', () => {
      // Action & Assert
      expect(threadRepo.validateID('thread-12x'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when threadID found', async () => {
      // Arrange
      const newThread = new AddThread({
        userID: 'user-123',
        title: 'Thread Titile',
        body: 'thread body',
      });
      
      // Action
      const isValidThreadID = await threadRepo.addThread(newThread);

      // Action & Assert
      await expect(threadRepo.validateID('thread-123')).resolves.not.toThrow(NotFoundError);
      expect(isValidThreadID).toBeTruthy();
    })
  });

  describe('getThreadById', () => {
    it('should return thread by id', async () => {
      // Arrange
      const newThread = new AddThread({
        userID: 'user-123',
        title: 'Thread Titile',
        body: 'thread body',
      });
      const thredRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      await thredRepository.addThread(newThread);
      
      // Action & Assert
      const expectedReturn = new ThreadDetail({
        id: 'thread-123',
        title: 'Thread Titile',
        body: 'thread body',
        date: expect.any(String),
        username: 'dicoding',
        comments: []
      });
      const thread = await thredRepository.getThreadById('thread-123');
      expect(thread).toStrictEqual(expectedReturn);
    });

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const thredRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);  
      // Action & Assert
      await expect(thredRepository.getThreadById('thread-123')).rejects.toThrow(NotFoundError);
    })
  });

});
