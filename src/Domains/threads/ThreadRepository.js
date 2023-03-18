class ThreadRepository {
  async addThread(thread) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getThreadByID(username) {
    throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  // async getIdByUsername(username) {
  //   throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  // }
}

module.exports = ThreadRepository;
