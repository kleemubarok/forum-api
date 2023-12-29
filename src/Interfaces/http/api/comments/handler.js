const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({ 
      ...request.payload,
      userID: request.auth.credentials.id,
      ...request.params,
     });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentsUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentsUseCase.execute({
      userID: request.auth.credentials.id,
      ...request.params,
    });

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentsHandler;