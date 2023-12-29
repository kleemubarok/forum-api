/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment({ userID = 'user-123', content = 'content', threadID = 'thread-123' }) {
    const id = 'comment-test123';
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, userID, 'N', createdAt, createdAt, threadID],
    };

    await pool.query(query);
  },

  async findCommentByID(commentID) {
    const result = await pool.query({
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [commentID],
    });
    return result.rows[0];
  },

  async getAllComment() {
    const result = await pool.query({
      text: 'SELECT * FROM comments',
    });
    return result.rows;
  },

  async deleteComment({ commentID = 'comment-test123' }) {
    await pool.query({
      text: 'UPDATE comments SET is_delete = $1, updated_at = $2 WHERE id = $3',
      values: [true, new Date().toISOString(), commentID],
    });
  },

  async validateThreadComments({ threadID = 'thread-123', commentID = 'comment-test123' }) {
    const result = await pool.query({
      text: 'SELECT id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentID, threadID],
    });

    if (!result.rowCount) throw new NotFoundError('Komentar tidak ditemukan di thread ini');
  },

  async validateCommentOwner({ commentID = 'comment-test123', owner = 'user-123' }) {
    const result = await pool.query({
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [commentID, owner],
    });
    if (!result.rowCount) throw new AuthorizationError('Tidak dapat menghapus komentar milik orang lain');
  },

  async getCommentByThreadID({ threadID = 'thread-123' }) {
    const result = await pool.query({
      text: `
      SELECT c.id, u.username, c.created_at as date, c.content, c.is_delete
      FROM comments c
      INNER JOIN users u ON u.id = c.owner
      WHERE c.thread_id = $1
      GROUP BY c.id, u.username
      ORDER BY c.created_at ASC`,
      values: [threadID],
    });

    return result.rows.map((comment) => new CommentDetail(comment));
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
