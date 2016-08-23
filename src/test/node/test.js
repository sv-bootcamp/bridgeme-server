import test from 'tape';

//sample test for 'pass'
test('A passing test', (t) => {
  t.pass('This test will pass.');
  t.end();
});

//sample test for 'equal'
test('Assertions with tape.', (t) => {
  const expected = 'something to test';
  const actual = 'something to test';

  t.equal(actual, expected);
  t.end();
});
