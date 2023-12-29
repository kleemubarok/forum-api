const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadID}/comments',
    handler: handler.postCommentHandler,
    options: {
      auth: 'forumApiService',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadID}/comments/{commentID}',
    handler: handler.deleteCommentHandler,
    options: {
      auth: 'forumApiService',
    },
  },
];

module.exports = routes;
