import { path, fs, $, echo } from "zx";
import { spinner } from "zx/experimental";
import ejs from "ejs";
import prettier from "prettier";
import { getUILib, selectBuiltInFeatures } from "./prompts.js";
import { exit } from "./help.js";
import { successLog, linkLog, errorText } from "./print.js";
import {xmovTmplPath} from './load.js';
const templateFiles: string[] = [
  "presets/presets.ts",
  "package.json",
  "tsconfig.json",
  "src/main.ts",
  "src/App.vue",
  "src/router/index.ts",
  // "vite.config.ts",
];

const ejsRender = async (filePath: string, options: any) => {
  const { tmplDir, appDir } = options;
  const outputFilePath = path.resolve(appDir, "./", filePath);
  const file = path.parse(outputFilePath);
  const readFilePath = path.resolve(file.dir, "./", `${file.name}.ejs`);
  const templateCode = await fs.readFile(readFilePath);
  const code = ejs.render(templateCode.toString(), options);
  const extname = path.extname(filePath).replace(/[.]/g, "");
  let prettierCode: string = "";
  await prettier.resolveConfig(tmplDir).then((opts) => {
    switch (extname) {
      case "ts":
        prettierCode = prettier.format(code, { parser: "babel", ...opts });
        break;
      case "js":
        prettierCode = prettier.format(code, { parser: "babel", ...opts });
        break;
      case "vue":
        prettierCode = prettier.format(
          code,
          Object.assign(opts, { parser: extname })
        );
        break;
      default:
        prettierCode = prettier.format(code, { parser: extname });
        break;
    }
  });
  await fs.outputFile(outputFilePath, prettierCode);
  await fs.remove(readFilePath);
};

export const createProject = async (project_name: string) => {
  // CLI 模板文件夹路径
  const tmplDir = xmovTmplPath;
  const appDir = path.resolve(process.cwd(), project_name);
  // 执行自定义选项
  const { UIComponents } = await getUILib();
  const { builtInFeatures } = await selectBuiltInFeatures();
  const features = JSON.stringify(builtInFeatures);
  let startTime: number, endTime: number;
  // 开始记录用时
  startTime = new Date().getTime();
  // 拷贝基础模板文件
  await fs.copy(tmplDir, appDir, {
    filter: (src) => {
      const curFile = path.parse(src);
      if(!features.includes('FileRoute') && curFile.base === '[...all].vue'){
        return false;
      }
      return true;
    }
  });
  // 模板渲染，设置一些默认配置项
  await spinner("创建项目...", () =>
    Promise.all(
      templateFiles.map((file) =>
        ejsRender(file, {
          project_name,
          tmplDir,
          appDir,
          needVueUse: features.includes("VueUse"),
          needFileRoute: features.includes("FileRoute"),
          UIComponents,
        })
      )
    ).catch((err) => exit(errorText(`😥 模板渲染失败 ${err}`)))
  );
  // Git 初始化
  await $`cd ${project_name} && git init && git add . && git commit -m "build: initialize by mint-cli"`;
  endTime = new Date().getTime();
  const usageTime = ((endTime - startTime) / 1000).toString();
  successLog(`🎉 项目创建成功，用时${usageTime}s`);
  linkLog(`🗂 ${appDir}`);
};
