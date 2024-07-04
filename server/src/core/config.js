import dotenv from 'dotenv';
dotenv.config();

export const getBackupPath = () => {
  const segments = targetFilePath.split('/');
  segments.pop();
  segments.push('_backups');
  return segments.join('/');
};

const softwareYamlPath = process.env.SOURCE_FILE;
const targetFilePath = process.env.TARGET_FILE;
const BACKUP_DEPTH = process.env.BACKUP_DEPTH || 5;
const BACKUP_INTERVAL = process.env.BACKUP_INTERVAL || 10;
const backupBasePath = getBackupPath();



export {
  softwareYamlPath,
  targetFilePath,
  backupBasePath,
  BACKUP_DEPTH,
  BACKUP_INTERVAL
};