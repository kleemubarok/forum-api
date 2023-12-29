const CommentDetail = require('../CommentDetail');

describe('a CommentDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'comments',
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123', 
      username: 123, 
      date: '2022-01-01T00:00:00.000Z', 
      content: 'abc', 
      is_delete: 123,
    };

    // Action and Assert
    expect(() => new CommentDetail(payload)).toThrowError('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return CommentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123', 
      username: 'johndoe', 
      date: '2022-01-01T00:00:00.000Z', 
      content: 'abc', 
      is_delete: false,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.is_delete).toEqual(payload.is_delete);
    expect(commentDetail.content).toEqual(payload.content);
  });

  it('should return CommentDetail object correctly when deleted', () => {
    // Arrange
    const payload = {
      id: 'comment-123', 
      username: 'johndoe', 
      date: '2022-01-01T00:00:00.000Z', 
      content: 'abc', 
      is_delete: true,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.content).toEqual('**komentar telah dihapus**')
  });



});
