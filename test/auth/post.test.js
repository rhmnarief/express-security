const appRequest = require('../appRequest');
const {
  userMerchant,
  userNonMerchant
} = require('../constantTest');

describe('POST /api/auth/signup', () => {
  beforeAll(async () => {
    await appRequest
      .post('/api/auth/signup')
      .send(userMerchant);
  });
  test('Should response email has been taken  ', async () => {
    const resRegisterSameEmail = await appRequest
      .post('/api/auth/signup')
      .send({
        email: userMerchant.email,
        password: '12345678',
        role_id: 1,
        name: 'Merchant'
      });

    expect(resRegisterSameEmail.status).toBe(400);
    expect(resRegisterSameEmail.body).toStrictEqual({
      status: "fail",
      data: {email: "email has already been taken"}
    })
  })

  test('Should response success', async () => {
    const newUserMerchant = {
      email: 'newUser@gmail.com',
      password: 'nonmerchant123',
      role_id: 2,
      name: 'Non Merchant'
  }
    const resRegisterUniqueEmail = await appRequest
      .post('/api/auth/signup')
      .send(newUserMerchant);
    expect(resRegisterUniqueEmail.status).toBe(201);
  })
})

describe('POST /api/auth/login', () => {
  test('should respond logged in and send cookies httpOnly sameSite=Lax secure=true maxAge=3600', async () => {
    const res = await appRequest.post('/api/auth/login').send({ email: userNonMerchant.email, password: userNonMerchant.password });

    expect(res.status).toBe(200);
    expect(res.body).toStrictEqual({
      status: 'success',
      data: null,
    });
    expect(res.header['set-cookie'][0]).toContain('token');
    expect(res.header['set-cookie'][0]).toContain('HttpOnly');
    expect(res.header['set-cookie'][0]).toContain('Max-Age=3600');
    expect(res.header['set-cookie'][0]).toContain('Secure');
    // expect(res.header['set-cookie'][0]).toContain('SameSite=Lax');
  });

  test('should respond invalid (wrong password)', async () => {
    const res = await appRequest
      .post('/api/auth/login')
      .send({ email: userMerchant.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      status: 'fail',
      data: { message: 'invalid email and password' },
    });
  });

  test('should respond invalid (no email in database)', async () => {
    const res = await appRequest
      .post('/api/auth/login')
      .send({ email: 'randomz90192498@gmail.com', password: userNonMerchant.password });

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      status: 'fail',
      data: { message: 'invalid email and password' },
    });
  });

  test('should respond invalid (send email: null, password: null)', async () => {
    const res = await appRequest
      .post('/api/auth/login')
      .send({ email: null, password: null });

    expect(res.status).toBe(401);
    expect(res.body).toStrictEqual({
      status: 'fail',
      data: { message: 'invalid email and password' },
    });
  });
});
