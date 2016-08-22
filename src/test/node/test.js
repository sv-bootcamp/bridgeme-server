import test from 'tape';

test('A passing test', (t) => {
  t.pass('This test will pass.');
  t.end();
});

test('Assertions with tape.', (t) => {
  const expected = 'something to test';
  const actual = 'something to test';

  t.equal(actual, expected);
  t.end();
});
