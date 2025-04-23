import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read version from the library package.json (corrected path)
const packageJsonPath = path.resolve(
	__dirname,
	'../../../packages/svelte-reactive-table/package.json'
);
const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageData.version;

// Create the version file content
const versionFileContent = `// This file is auto-generated. Do not edit directly.
export const version = '${version}';
`;

// Ensure the directory exists
const targetDir = path.resolve(__dirname, '../src/lib/shared/config');
if (!fs.existsSync(targetDir)) {
	fs.mkdirSync(targetDir, { recursive: true });
}

// Write to the version.ts file
const versionFilePath = path.resolve(targetDir, 'version.ts');
fs.writeFileSync(versionFilePath, versionFileContent);

console.log(`Version file generated at ${versionFilePath} with version ${version}`);
