export default {
  successRegister: {
    successCode: 1,
    result: {
      msg: 'Register success.',
    },
  },
  successSignin: {
    successCode: 1,
    result: {
      msg: 'sign in success.',
    },
  },
  failRegister: {
    successCode: 0,
    result: {
      msg: 'Failed to register',
    },
  },
  failSignin: {
    successCode: 0,
    result: {
      msg: 'Failed to sign in.',
    },
  },
  failAuth: {
    successCode: 0,
    result: {
      msg: 'Authentication failed. Please sign in first.',
    },
  },
};
