class AddComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userID, content, threadID } = payload;

    this.userID = userID;
    this.content = content;
    this.threadID = threadID;
  }

  _verifyPayload({  userID, content, threadID }) {
    if (!userID || !content || !threadID ) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof userID !== 'string' ||typeof content !== 'string' || typeof threadID !== 'string' ) {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

  }
}

module.exports = AddComment;
