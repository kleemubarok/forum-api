const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when GET /threads', () => {
    it('should response 200 and return threads correctly', async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      // Action and assert
      const threadID = 'thread-123';
      const response = await server.inject({
        method: 'GET',
        url: `/threads/`+threadID,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const payload = {
        title: 'a title',
        body: 'a body that related to the title',
      };

      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();

      // Action and assert
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });  
  });

  describe('when POST /threads/{threadID}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange a thread first
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadID = 'thread-123';

      const payload = {
        content: 'a comment for testing',
      };

      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();

      // Action and assert
      const response = await server.inject({
        method: 'POST',
        url: `/threads/`+threadID+`/comments`,
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });  
  });

  describe('when DELETE /threads/{threadID}/comments', () => {
    it('should successfully delete comment', async () => {
      // Arrange a thread and a comment first
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      const threadID = 'thread-123';
      await CommentsTableTestHelper.addComment({});
      const commentID = 'comment-test123';

     
      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();

      // Action and assert
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadID}/comments/${commentID}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });  
  });


});
