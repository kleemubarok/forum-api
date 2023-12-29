const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userID: 'userID-123',
      title: 'test title',
      body: 'test body',
    };

    const expectedAddedThread = new AddedThread({
      id: 'title-123',
      title: useCasePayload.title,
      owner: 'userID-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    const mockAddedThread = new AddedThread({
      id: 'title-123',
      title: useCasePayload.title,
      owner: useCasePayload.userID,
    });
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockAddedThread));

    /** creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      userID : useCasePayload.userID,
      title : useCasePayload.title,
      body : useCasePayload.body,
    }));
  });
});
