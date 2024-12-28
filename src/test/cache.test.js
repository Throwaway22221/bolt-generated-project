import { getCachedEmails, setCachedEmails, invalidateCache } from '../cache';
import test from './testRunner';
import assert from './assert';

test('setCachedEmails should store emails in localStorage', () => {
  setCachedEmails('test-user', [{ id: '1', subject: 'Test Email' }]);
  const cachedData = localStorage.getItem('email_cache');
  assert(cachedData !== null, 'setCachedEmails should store emails in localStorage');
  const cache = JSON.parse(cachedData);
  assert(cache['test-user'] !== undefined, 'setCachedEmails should store emails for the correct user');
  assert(cache['test-user'].length === 1, 'setCachedEmails should store the correct number of emails');
});

test('setCachedEmails should handle multiple users', () => {
  setCachedEmails('test-user-1', [{ id: '1', subject: 'Test Email 1' }]);
  setCachedEmails('test-user-2', [{ id: '2', subject: 'Test Email 2' }]);
  const cachedData = localStorage.getItem('email_cache');
  assert(cachedData !== null, 'setCachedEmails should store emails in localStorage');
  const cache = JSON.parse(cachedData);
  assert(cache['test-user-1'] !== undefined, 'setCachedEmails should store emails for the correct user');
  assert(cache['test-user-2'] !== undefined, 'setCachedEmails should store emails for the correct user');
  assert(cache['test-user-1'].length === 1, 'setCachedEmails should store the correct number of emails');
  assert(cache['test-user-2'].length === 1, 'setCachedEmails should store the correct number of emails');
});

test('getCachedEmails should retrieve emails from localStorage', () => {
  localStorage.setItem('email_cache', JSON.stringify({ 'test-user': [{ id: '1', subject: 'Test Email' }] }));
  const emails = getCachedEmails('test-user');
  assert(Array.isArray(emails), 'getCachedEmails should return an array');
  assert(emails.length === 1, 'getCachedEmails should return the correct number of emails');
});

test('getCachedEmails should return null if no emails are found', () => {
  const emails = getCachedEmails('non-existent-user');
  assert(emails === null, 'getCachedEmails should return null if no emails are found');
});

test('getCachedEmails should return null if localStorage is empty', () => {
  localStorage.removeItem('email_cache');
  const emails = getCachedEmails('test-user');
  assert(emails === null, 'getCachedEmails should return null if localStorage is empty');
});

test('invalidateCache should remove emails from localStorage', () => {
  localStorage.setItem('email_cache', JSON.stringify({ 'test-user': [{ id: '1', subject: 'Test Email' }] }));
  invalidateCache('test-user');
  const cachedData = localStorage.getItem('email_cache');
  const cache = JSON.parse(cachedData);
  assert(cache['test-user'] === undefined, 'invalidateCache should remove emails from localStorage');
});

test('invalidateCache should not throw an error if user does not exist', () => {
  try {
    invalidateCache('non-existent-user');
  } catch (error) {
    assert(false, 'invalidateCache should not throw an error if user does not exist');
  }
});
