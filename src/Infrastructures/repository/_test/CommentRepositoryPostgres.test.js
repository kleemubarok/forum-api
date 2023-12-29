const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  })

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123'; // stub!

  describe('addComment function', () => {
    it('should persist added comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new AddComment({
        userID: 'user-123',
        content: 'content',
        threadID: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const  addedComment = await commentRepository.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: newComment.userID,
      }));
      expect(addedComment).toBeInstanceOf(AddedComment);
      const comment = await CommentsTableTestHelper.findCommentByID('comment-123');
      expect(comment).toHaveProperty('id', 'comment-123');
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment completely and set flag tobe y', async () => {
      // Arrange
      const newComment = new AddComment({
        userID: 'user-123',
        content: 'content',
        threadID: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepository.addComment(newComment);
      //check if flag is false
      const addedComment = await CommentsTableTestHelper.findCommentByID('comment-123');
      expect(addedComment).toHaveProperty('is_delete', false);

      // delete comment
      await commentRepository.deleteComment('comment-123');

      // Assert
      const deletedComment = await CommentsTableTestHelper.findCommentByID('comment-123');
      expect(deletedComment).toHaveProperty('is_delete', true);
    });
  });

  describe('validateThreadComments', () => {
    it('should throw NotFoundError when commentID not found', () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      expect(commentRepository.validateThreadComments('thread-123', 'comment-123'))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when commentID found', async () => {
      // Arrange
      const newComment = new AddComment({
        userID: 'user-123',
        content: 'content',
        threadID: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepository.addComment(newComment);

      // Action & Assert
      await expect(commentRepository.validateThreadComments('thread-123', 'comment-123'))
        .resolves.not.toThrow(NotFoundError);
    })
  });

  describe('validateCommentOwner', () => {
    it('should return AuthorizationError when commentID is not belongs to the owner', async () => {
      // Arrange

      //add other user to comment on a thread
      await UsersTableTestHelper.addUser({
        id: 'user-xxx',
        username: 'dicoding-xxx',
        password: 'secret_password',
      });
      
      const newComment = new AddComment({
        userID: 'user-xxx',
        content: 'content',
        threadID: 'thread-123',
      });
      const fakeIdGenerator = () => 'xxx'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepository.addComment(newComment);
      
      // Action & Assert
      expect(commentRepository.validateCommentOwner('comment-xxx', 'user-123'))
        .rejects.toThrow(AuthorizationError);
    });

    it('should not throw AuthorizationError when commentID is belongs to the owner', async () => {
      // Arrange
      const newComment = new AddComment({
        userID: 'user-123',
        content: 'content',
        threadID: 'thread-123',
      });
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepository.addComment(newComment);

      // Action & Assert
      await expect(commentRepository.validateCommentOwner('comment-123', 'user-123'))
        .resolves.not.toThrow(AuthorizationError);
    })
  });

  describe('getCommentByThreadID', () => {
    it('should return all comments by thread id', async () => {
      // Arrange
      const thredID = 'thread-123';
      const firstComment = new AddComment({
        userID: 'user-123',
        content: 'content of first comment',
        threadID: thredID,
      });
      let fakeIdGenerator = () => '121'; 
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepository.addComment(firstComment);

      const secondComment = new AddComment({
        userID: 'user-123',
        content: 'content of second comment',
        threadID: thredID,
      });
      fakeIdGenerator = () => '122'; 
      const commentRepository2 = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepository2.addComment(secondComment);
      
      // Action & Assert
      const comment = await commentRepository.getCommentByThreadID(thredID);
      expect(comment).toHaveLength(2);
      expect(comment[0]).toEqual(new CommentDetail({
        id: 'comment-121',
        content: firstComment.content,
        username: 'dicoding',
        date: expect.any(String),
        is_delete: false
      }))
      expect(comment[1]).toEqual(new CommentDetail({
        id: 'comment-122',
        content: secondComment.content,
        username: 'dicoding',
        date: expect.any(String),
        is_delete: false
      }))
    });
  });

});
