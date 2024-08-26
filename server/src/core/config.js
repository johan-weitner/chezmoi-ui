import dotenv from "dotenv";
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const softwareYamlPath = process.env.SOURCE_FILE;
const softwareGroupYamlPath = process.env.SOURCE_GRP_FILE;

export { dbUrl, softwareYamlPath, softwareGroupYamlPath };
