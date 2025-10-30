import { config as dotenv } from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

dotenv({ path: '.env.test.local' });
