import test from 'tape'; 

test('Insert Mock Users test', (t) => { 
  let r = require('requestah')(8000); 
  r.get('/users/insertMock', res=>{ 
    t.equal(res.body, "Success");
     t.end();
   });
 });
