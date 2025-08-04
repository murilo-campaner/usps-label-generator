import EasyPost from '@easypost/api';

// Check if API key is defined
const apiKey = process.env.EASYPOST_API_KEY;

if (!apiKey) {
  throw new Error('EASYPOST_API_KEY is not defined in environment variables');
}

// Initialize EasyPost client
const client = new EasyPost(apiKey);

export default client;
