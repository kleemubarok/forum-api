const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'comments',
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      userID: 123,
      threadID: 123,
    };

    // Action and Assert
    expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddComment object correctly', () => {
    // Arrange
    const payload = {
      content: 'abc',
      userID: 'userxx',
      threadID: 'threadxx',
    };

    // Action
    const { userID, content, threadID } = new AddComment(payload);

    // Assert
    expect(userID).toEqual(payload.userID);
    expect(content).toEqual(payload.content);
    expect(threadID).toEqual(payload.threadID);
  });
});
