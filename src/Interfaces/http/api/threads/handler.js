const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadUseCase = require('../../../../Applications/use_case/GetThreadUseCase');
class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailHandler = this.getThreadDetailHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({ 
      ...request.payload,
      userID: request.auth.credentials.id,
     });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailHandler(request, h) {
    const threadUseCase = this._container.getInstance(GetThreadUseCase.name);
    const thread = await threadUseCase.execute(request.params);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    return response;
  }
}

module.exports = ThreadsHandler;
