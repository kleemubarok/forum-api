const ThreadComments = require('../../../Domains/threads/entities/ThreadComments');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');

describe('GetThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadID: 'thread-123',
    };

    const threadDetailMock = new ThreadDetail({
      id: 'thread-123',
      title: 'thread-title',
      body: 'thread-body',
      date: '2022-01-01',
      username: 'dicoding',
    });

    const threadCommentsMockup = [new CommentDetail({
      id: 'comment-qdUuE180HdirECWKlI6C1',
      username: 'dicoding',
      date: '2023-11-24T09:02:47.724Z',
      content: 'sebuah comment',
      is_delete: false,
    })];
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadComments = new ThreadComments(threadDetailMock, threadCommentsMockup);

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve( 
      new ThreadDetail({
        id: 'thread-123',
        title: 'thread-title',
        body: 'thread-body',
        date: '2022-01-01',
        username: 'dicoding',
      })
    ));
    mockCommentRepository.getCommentByThreadID = jest.fn(() => Promise.resolve(
      [new CommentDetail({
        id: 'comment-qdUuE180HdirECWKlI6C1',
        username: 'dicoding',
        date: '2023-11-24T09:02:47.724Z',
        content: 'sebuah comment',
        is_delete: false,
      })]
    ));

    /** creating use case instance */
    const getThreadCommentsUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadComments = await getThreadCommentsUseCase.execute(useCasePayload);
    // console.log(threadComments);

    // Assert
    expect(threadComments).toStrictEqual(mockThreadComments);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadID);
    expect(mockCommentRepository.getCommentByThreadID).toBeCalledWith(useCasePayload.threadID);

  });
});
