class CommentDetail {
    constructor(payload) {
      this._verifyPayload(payload);
  
      const {
        id, username, date, content, is_delete,
      } = payload;
  
      this.id = id;
      this.username = username;
      this.date = date;
      this.is_delete = is_delete;
  
      if (is_delete) {
        this.content = '**komentar telah dihapus**';
      } else {
        this.content = content;
      }
    }
  
    _verifyPayload({
      id, username, content, date,
    }) {
      if (!id || !username || !content || !date ) {
        throw new Error('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
      }
  
      if ([typeof id, typeof username, typeof content]
        .some((type) => type !== 'string')) {
        throw new Error('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
  
  module.exports = CommentDetail;
  