const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userID: 'user-123',
      threadID: 'thread-123',
      commentID: 'comment-123',
    };

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.validateThreadComments = jest.fn(() => Promise.resolve());
    mockCommentRepository.validateCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Act
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.validateThreadComments)
      .toHaveBeenCalledWith(useCasePayload.threadID, useCasePayload.commentID);
    expect(mockCommentRepository.validateCommentOwner)
      .toHaveBeenCalledWith(useCasePayload.commentID, useCasePayload.userID);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentID);
  });
});
