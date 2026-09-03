/**
 * Lightweight fake-email detection for the free-download gate and newsletter.
 * Rejects malformed addresses, placeholder/test addresses, and known
 * throwaway/10-minute-mail domains. It's a filter, not a guarantee — real
 * verification would require a double opt-in email.
 */

const THROWAWAY_DOMAINS = new Set([
  'mailinator.com', 'mailinator.net', 'mailinator.org', 'mailinator.io',
  'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.info',
  'grr.la', 'pokemail.net', 'spam4.me', 'spamgourmet.com',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.info',
  'tempmail.com', 'tempmail.net', 'tempmail.org', 'temp-mail.org', 'temp-mail.io',
  'tempail.com', 'tempr.email', 'temprmail.com',
  'throwawaymail.com', 'throwawayemail.com', 'thrownoway.info',
  'maildrop.cc', 'mailnesia.com', 'mintemail.com', 'mytemp.email', 'mytemp-mail.com',
  'yopmail.com', 'yopmail.fr', 'yopmail.net', 'yopmail.org', 'yopmail.xyz',
  'dispostable.com', 'getnada.com', 'nada.email', 'dropmail.me', 'emailondeck.com',
  'moakt.com', 'moakt.co', 'mailmetrash.com', 'trashmail.com', 'trashmail.de',
  'trashmail.net', 'trashmail.org', 'trashmail.me', 'trashmail.ws', 'trashmail.se',
  'trashymail.com', 'tmail.ws', 'tmailor.com', 'mailcatch.com', 'mailexpire.com',
  'mailmoat.com', 'meltmail.com', 'tmpmail.org', 'tmpmail.net', 'tmpmail.io',
  'fakemail.net', 'fakemailgenerator.com', 'fakeinbox.com', 'fake-mail.net',
  'fammail.net', 'sharklasers.com', 'guerrillamailblock.com',
  'example.com', 'example.org', 'example.net', 'example.edu',
  'test.com', 'test.net', 'test.org', 'testsite.com', 'email.com',
  'yourdomain.com', 'sentry.io', 'sendgrid.net', 'smtp.jp', 'localhost',
])

const PLACEHOLDER_LOCAL = new Set([
  'test', 'testing', 'test1', 'test2', 'test3', 'asdf', 'asd', 'qwerty', 'abc', 'abcd',
  'foo', 'bar', 'foobar', 'user', 'admin', 'root', 'guest', 'email', 'mail', 'name',
  'yourname', 'firstname', 'lastname', 'someone', 'nobody', 'dummy', 'example',
  'fake', 'sample', 'temp', 'temporary', 'me', 'hello', 'hi', 'id', 'new', 'one',
  'two', 'a', 'b', 'x', 'default', 'person', 'contact', 'info',
])

export function isLikelyFakeEmail(email) {
  const value = String(email || '').trim().toLowerCase()
  if (!value) return true
  // Basic format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return true
  // Single-character or very short full address
  if (value.length < 6) return true

  const at = value.lastIndexOf('@')
  const localRaw = value.slice(0, at)
  const domain = value.slice(at + 1)

  if (THROWAWAY_DOMAINS.has(domain)) return true

  // Compare the local part without dots/underscores and anything after '+'
  const base = localRaw.split('+')[0].toLowerCase().replace(/[._-]+/g, '')
  if (!base) return true
  if (PLACEHOLDER_LOCAL.has(base)) return true
  // Pure-numeric local parts (e.g. 123456@...) are almost always throwaway
  if (/^\d{5,}$/.test(base)) return true

  return false
}
