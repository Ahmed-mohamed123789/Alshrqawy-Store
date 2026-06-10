const axios = require('axios');

async function testSignup() {
  try {
    const response = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', {
      name: 'Test User',
      email: 'test123456789@example.com',
      password: 'password123',
      rePassword: 'password123'
    });
    console.log(response.data);
  } catch (error) {
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testSignup();
