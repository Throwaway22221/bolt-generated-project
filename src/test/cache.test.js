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

test('invalidateCache should remove emails from localStorage', () => {
  localStorage.setItem('email_cache', JSON.stringify({ 'test-user': [{ id: '1', subject: 'Test Email' }] }));
  invalidateCache('test-user');
  const cachedData = localStorage.getItem('email_cache');
  const cache = JSON.parse(cachedData);
  assert(cache['test-user'] === undefined, 'invalidateCache should remove emails from localStorage');
});
