const ThreadComments = require('../../Domains/threads/entities/ThreadComments');

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {    
    const thread = await this._threadRepository.getThreadById(useCasePayload.threadID);
    const comments = await this._commentRepository.getCommentByThreadID(useCasePayload.threadID);

    // console.log(new ThreadComments(thread, comments));
    return new ThreadComments(thread, comments);
  }
}

module.exports = GetThreadUseCase;
