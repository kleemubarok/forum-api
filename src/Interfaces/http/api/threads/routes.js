const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads',
    handler: handler.postThreadHandler,
    options: {
      auth: 'forumApiService',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadID}',
    handler: handler.getThreadDetailHandler,
  },
];

module.exports = routes;
