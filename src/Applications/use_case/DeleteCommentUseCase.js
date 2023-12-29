const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);

    await this._commentRepository.validateThreadComments(deleteComment.threadID, deleteComment.commentID);
    await this._commentRepository.validateCommentOwner(deleteComment.commentID, deleteComment.userID);

    return this._commentRepository.deleteComment(deleteComment.commentID);
  }
}

module.exports = DeleteCommentUseCase;

//TODO: add _test for usecases