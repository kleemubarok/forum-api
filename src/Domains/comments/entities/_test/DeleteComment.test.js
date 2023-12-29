const DeleteComment = require('../DeleteComment');

describe('a DeleteComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      userID : 100,
      threadID : 111,
      commentID : 111,
    };

    // Action and Assert
    expect(() => new DeleteComment(payload)).toThrowError('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DeleteComment object correctly', () => {
    // Arrange
    const payload = {
      userID : 'user-123',
      threadID : 'thread-123',
      commentID : 'comment-123',
    };

    // Action
    const { userID, commentID, threadID } = new DeleteComment(payload);

    // Assert
    expect(userID).toEqual(payload.userID);
    expect(commentID).toEqual(payload.commentID);
    expect(threadID).toEqual(payload.threadID);
  });
});
