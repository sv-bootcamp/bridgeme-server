import test from 'tape';

// Sample test for 'pass'.
test('A passing test', (t) => {
  t.pass('This test will pass.');
  t.end();
});

// Sample test for 'equal'.
test('Assertions with tape.', (t) => {
  const expected = 'something to test';
  const actual = 'something to test';

  t.equal(actual, expected);
  t.end();
});
