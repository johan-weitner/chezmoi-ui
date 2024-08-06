import dotenv from "dotenv";
dotenv.config();

const softwareYamlPath = process.env.SOURCE_FILE;
const softwareGroupYamlPath = process.env.SOURCE_GRP_FILE;

export { softwareYamlPath, softwareGroupYamlPath };
