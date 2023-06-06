import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  DEVELOPER_TOKEN: process.env.DEVELOPER_TOKEN,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
};
