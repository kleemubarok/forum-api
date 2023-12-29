const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userID: 'userID-dcdc',
      content: 'content',
      threadID: 'threadID',
    };

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'content',
      owner: 'userID-dcdc',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.validateID = jest.fn(() => Promise.resolve(true));
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(
      new AddedComment({
        id: 'comment-123',
        content: 'content',
        owner: 'userID-dcdc',
      })
    ));

    /** creating use case instance */
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.validateID).toBeCalledWith(useCasePayload.threadID);
    expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
      userID : useCasePayload.userID,
      content : useCasePayload.content,
      threadID : useCasePayload.threadID,
    }));
  });
});
