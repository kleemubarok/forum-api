class ThreadComments {
  constructor(threadDetail, threadComment) {
    const {
      id, title, body, date, username,
    } = threadDetail;

    if (!Array.isArray(threadComment)) 
      throw new Error('THREAD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');


    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = threadComment;
  }


}

module.exports = ThreadComments;
