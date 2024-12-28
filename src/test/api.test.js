import { fetchEmails, fetchEmailContent, deleteEmail } from '../api';
import test from './testRunner';
import assert from './assert';

// Mock fetch function
global.fetch = jest.fn();

test('fetchEmails should return an array of emails', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ value: [{ id: '1', subject: 'Test Email' }] }),
  });
  const emails = await fetchEmails('test-token', 'test-user');
  assert(Array.isArray(emails), 'fetchEmails should return an array');
  assert(emails.length > 0, 'fetchEmails should return at least one email');
});

test('fetchEmails should throw an error if the response is not ok', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 404,
  });
  try {
    await fetchEmails('test-token', 'test-user');
    assert(false, 'fetchEmails should throw an error');
  } catch (error) {
    assert(error.message.includes('HTTP error! status: 404'), 'fetchEmails should throw an error with status 404');
  }
});

test('fetchEmailContent should return an email object', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: '1', subject: 'Test Email', body: { content: 'Test Content' } }),
  });
  const email = await fetchEmailContent('test-token', '1');
  assert(typeof email === 'object', 'fetchEmailContent should return an object');
  assert(email.id === '1', 'fetchEmailContent should return the correct email');
});

test('fetchEmailContent should throw an error if the response is not ok', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 404,
  });
  try {
    await fetchEmailContent('test-token', '1');
    assert(false, 'fetchEmailContent should throw an error');
  } catch (error) {
    assert(error.message.includes('HTTP error! status: 404'), 'fetchEmailContent should throw an error with status 404');
  }
});

test('deleteEmail should not throw an error if the response is ok', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
  });
  try {
    await deleteEmail('test-token', '1');
  } catch (error) {
    assert(false, 'deleteEmail should not throw an error');
  }
});

test('deleteEmail should throw an error if the response is not ok', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 404,
  });
  try {
    await deleteEmail('test-token', '1');
    assert(false, 'deleteEmail should throw an error');
  } catch (error) {
    assert(error.message.includes('HTTP error! status: 404'), 'deleteEmail should throw an error with status 404');
  }
});
