import EasyPost from '@easypost/api';

// Check if API key is defined
const apiKey = process.env.EASYPOST_API_KEY;

// Debug log to check environment variables
console.log('🔍 Environment Debug:', {
  hasApiKey: !!apiKey,
  apiKeyLength: apiKey?.length || 0,
  apiKeyPrefix: apiKey?.substring(0, 8) || 'N/A',
  nodeEnv: process.env.NODE_ENV,
  allEnvKeys: Object.keys(process.env).filter(key => key.includes('EASYPOST'))
});

if (!apiKey) {
  throw new Error('EASYPOST_API_KEY is not defined in environment variables');
}

// Initialize EasyPost client
const client = new EasyPost(apiKey);

export default client;
