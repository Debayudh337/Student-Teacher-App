import redis from '../config/redis.js';

const TEMP_USER_TTL = 900;  // 15 minutes TTL

export const storeTempUser = async (data) => {
  const key = `tempuser:${data.email}`;
  await redis.set(key, JSON.stringify(data), 'EX', TEMP_USER_TTL);  // ioredis syntax
};

export const getTempUser = async (email) => {
  const key = `tempuser:${email}`;
  const userData = await redis.get(key);
  return userData ? JSON.parse(userData) : null;
};

export const deleteTempUser = async (email) => {
  const key = `tempuser:${email}`;
  await redis.del(key);
};

export const updateTempUser = async (email, updatedData) => {
  const existingData = await getTempUser(email);
  if (!existingData) throw new Error('User not found in Redis');

  const newData = { ...existingData, ...updatedData };
  await storeTempUser(newData);
};
