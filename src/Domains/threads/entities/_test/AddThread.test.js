const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'abc',
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      userID: 'xxxxuser',
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const payload = {
      userID: 'xxxxuser',
      title: 'dicoding',
      body: 'Dicoding Indonesia',
    };

    // Action
    const { userID, title, body } = new AddThread(payload);

    // Assert
    expect(userID).toEqual(payload.userID);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
