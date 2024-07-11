import dotenv from "dotenv";
dotenv.config();

const softwareYamlPath = process.env.SOURCE_FILE;

export { softwareYamlPath };
