const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { userID: owner, content, threadID } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, owner, 'N', createdAt, createdAt, threadID],
    };

    const result = await this._pool.query(query);
    
    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(commentID) {
    await this._pool.query({
      text: 'UPDATE comments SET is_delete = $1, updated_at = $2 WHERE id = $3',
      values: [true, new Date().toISOString(), commentID],
    });
  }

  async validateThreadComments(threadID, commentID) {
    const result = await this._pool.query({
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentID, threadID],
    });

    if (!result.rowCount) throw new NotFoundError('Komentar tidak ditemukan di thread ini');
  }

  async validateCommentOwner(commentID, owner) {
    const result = await this._pool.query({
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentID, owner],
    });

    if (!result.rowCount) throw new AuthorizationError('Tidak dapat menghapus komentar milik orang lain');
  }

  async getCommentByThreadID(threadId) {
    const result = await this._pool.query({
      text: `
      SELECT c.id, u.username, c.created_at as date, c.content, c.is_delete
      FROM comments c
      INNER JOIN users u ON u.id = c.owner
      WHERE c.thread_id = $1
      GROUP BY c.id, u.username
      ORDER BY c.created_at ASC`,
      values: [threadId],
    });

    return result.rows.map((comment) => new CommentDetail(comment));
  }
}

module.exports = CommentRepositoryPostgres;
