const ThreadComments = require('../ThreadComments');

describe('an ThreadComments entities', () => {
  it('should throw error when payload initiate did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'dicoding thread',
      body: 'comment sample',
    };

    // Action and Assert
    expect(() => new ThreadComments(payload,'some string')).toThrowError('THREAD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });


  it('should create addedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'dicoding',
      body: 'comment body',
      date: new Date().toISOString(),
      username: 'user-123',
    };

    // Action
    const threadComments = new ThreadComments(payload,[]);

    // Assert
    expect(threadComments.id).toEqual(payload.id);
    expect(threadComments.title).toEqual(payload.title);
    expect(threadComments.body).toEqual(payload.body);
    expect(threadComments.date).toEqual(payload.date);
    expect(threadComments.username).toEqual(payload.username);
    expect(threadComments.comments).toEqual([]);
  });
});
