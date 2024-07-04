import dotenv from 'dotenv';
dotenv.config();

const softwareYamlPath = process.env.SOURCE_FILE;
const targetFilePath = process.env.TARGET_FILE;
const BACKUP_DEPTH = process.env.BACKUP_DEPTH || 5;
const BACKUP_INTERVAL = process.env.BACKUP_INTERVAL || 10;
const backupPaths = [];

export {
  softwareYamlPath,
  targetFilePath,
  BACKUP_DEPTH,
  BACKUP_INTERVAL,
  backupPaths
};