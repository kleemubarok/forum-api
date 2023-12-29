class DeleteComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userID, threadID, commentID } = payload;

    this.userID = userID;
    this.threadID = threadID;
    this.commentID = commentID;
  }

  _verifyPayload({ userID, threadID, commentID }) {
    if (!commentID || !threadID) {
      throw new Error('DELETE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentID !== 'string' || typeof threadID !== 'string') {
      throw new Error('DELETE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteComment;
