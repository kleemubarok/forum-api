const InvariantError = require('../../Commons/exceptions/InvariantError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const UserRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends UserRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThread) {
    const { title, body } = addThread;
    const id = `thread-${this._idGenerator()}`;
    const owner = `user-LvrRC3WZYsG-9wA1DFVWn`; // TODO: Change this
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6) RETURNING id, title, owner',
      values: [id, title, body, owner, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    let query = {
      text: 'SELECT id, title, body, created_at as date, username FROM threads t inner join users u WHERE t.owner = u.id AND t.id = $1',
      values: [id],
    };

    let result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('thread tidak ditemukan');
    }

    // TODO: beresin ini pisah aja.
    const threadResult = result.rows[0];

    query.text =
      'SELECT id, username, created_at as date, content FROM comments c INNER JOIN users u ON u.id=c.owner AND c.thread_id = $1 ORDER BY date DESC';

    const threadComments = await this._pool.query(query);

    return result.rows[0];
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('user tidak ditemukan');
    }

    const { id } = result.rows[0];

    return id;
  }
}

module.exports = UserRepositoryPostgres;
