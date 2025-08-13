import axios from 'axios';

const testLogin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
  }
};

testLogin();
