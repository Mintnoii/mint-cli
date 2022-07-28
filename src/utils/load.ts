import { path, fs } from "zx";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// mint cli 模板路径
export const mintTmplPath = path.resolve(__dirname, "../../mintTmpl");

// 默认模板配置文件路径
export const defaultTmplJSONPath = path.resolve(__dirname, "../templates/default.json");

// 自定义模板配置文件路径
export const customTmplJSONPath = path.resolve(__dirname, "../templates/custom.json");

// 脚手架 package.json 路径
export const packageJSONPath = path.resolve(__dirname, "../../package.json");

export const loadDefaultTemplates = () => fs.readJSONSync(defaultTmplJSONPath);

export const loadCustomTemplates = () => fs.readJSONSync(customTmplJSONPath);

export const loadPackageJson = () => fs.readJSONSync(packageJSONPath);
