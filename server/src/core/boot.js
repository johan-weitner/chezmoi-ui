import fs from 'fs';
import {
  softwareYamlPath,
  targetFilePath,
  backupBasePath
} from './config.js';
import { styles } from "../util/styles.js";
import { printAppLogo } from "./logo.js";
import { log } from '../util/log.js';

/**
 * Exports a set of styles used for logging and formatting output in the application.
 * The exported styles include:
 * - `success`: A style for successful messages
 * - `warn`: A style for warning messages
 * - `error`: A style for error messages
 * - `bold`: A style for bold text
 * - `italic`: A style for italic text
 * - `check`: A checkmark symbol
 * - `cross`: An X symbol
 * - `wsign`: A warning symbol
 */
export const { success, warn, error, bold, italic, check, cross, wsign } = styles;

// Redundant?
export let backupPaths = [];

// Redundant?
if (fs.existsSync(backupBasePath)) {
  const backupFiles = fs.readdirSync(backupBasePath);
  backupPaths = backupFiles.map(file => {
    return `${backupBasePath}/${file}`;
  });
}


/**
 * Initializes the backend server by performing the following steps:
 * - Prints the application logo.
 * - Checks if the required environment variables (SOURCE_FILE and TARGET_FILE) are set.
 * - Checks if the source and work files exist.
 * - Prints setup info
 * - Sets up the file data by either opening an existing work-in-progress file or reading the source file to seed a starting point.
 *
 * @returns {Object} An object containing the software array and the software object.
 */
export const boot = () => {
  console.clear();
  printAppLogo();
  log.info('  © 2024 Johan Weitner')
  log.info(bold('\n\n-= STARTING BACKEND SERVER... =-\n'));

  console.log('BACKUP-PATH: ', backupPaths);

  _checkEnvVars();
  const { sourceExists, workExists } = _checkFileExistence();

  log.info(bold('Path to source file: ') + softwareYamlPath);
  sourceExists ?
    log.success(`Found ${check} \n`) :
    log.error(`Not found ${cross} \n`);
  log.info(bold('Path to work file: ') + targetFilePath);
  workExists ?
    log.success(`Found ${check} \n`) :
    log.error(`Not found ${cross} \n`);
  (process.env.BACKUP_INTERVAL && process.env.BACKUP_INTERVAL > 0) ?
    log.success(`Backup interval set to ${process.env.BACKUP_INTERVAL} min ${check} \n`) :
    log.warn(`${wsign}   Backup interval not set\n`);

  return _setupFileData();
};

const _checkEnvVars = () => {
  if (!softwareYamlPath || !targetFilePath) {
    log.error(error('Missing environment variables'));
    log.error(error('Please set SOURCE_FILE and TARGET_FILE, in either a .env file or in your environment'));
    process.exit(1);
  }
};

const _checkFileExistence = () => {
  const sourceExists = fs.existsSync(softwareYamlPath);
  const workExists = fs.existsSync(targetFilePath);

  if (!sourceExists && !workExists) {
    log.error(error('Neither source file nor work file exists '));
    log.error(error('\x1b[31m%s\x1b[0m', 'Please point SOURCE_FILE and TARGET_FILE to existing files'));
    process.exit(1);
  }

  return { sourceExists, workExists };
};

const _setupFileData = () => {
  let software, softwareArray;
  if (fs.existsSync(targetFilePath)) {
    log.info('Work in progress exists - opening WiP:');
    log.info(targetFilePath);

    softwareArray = fs.readFileSync(targetFilePath, 'utf8');
    software = JSON.parse(softwareArray);
    console.log(italic('List size: ' + Object.keys(software).length));
    return { softwareArray, software };
  } else {
    log.info('Work in progress does not exist - opening source file to seed a starting point:');
    log.info(softwareYamlPath);
    const softwareYaml = fs.readFileSync(softwareYamlPath, 'utf8');
    software = YAML.parse(softwareYaml).softwarePackages;
    const keys = Object.keys(software);

    for (let i = 0; i < keys.length; i++) {
      softwareArray.push(software[keys[i]]);
      softwareArray[i].key = keys[i];
    }
    console.log(italic('List size: ' + keys.length));
    const backupPaths = _readBackups();
    return { softwareArray, software, backupPaths };
  }
};

const _readBackups = () => {
  if (fs.existsSync(backupBasePath)) {
    const backupFiles = fs.readdirSync(backupBasePath);
    const backupPaths = backupFiles.map(file => {
      return `${backupBasePath}/${file}`;
    });
    return backupPaths;
  } else {
    return [];
  }
};