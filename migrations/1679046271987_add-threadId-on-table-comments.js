/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addColumns('comments', {
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('comments', 'fk_comments.thread.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.users.id');
  pgm.dropColumns('comments', 'thread_id');
};
