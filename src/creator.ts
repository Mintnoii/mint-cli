import { $, echo } from "zx";
import {
  exit,
  startProject,
  checkAndClearDir,
  writePackageJson,
} from "./utils/help.js";
// import {selectPrivateNpm} from './utils/selectPrivateNpm.js';
import {getProjectInfo } from "./utils/prompts.js";
import { errorText } from "./utils/print.js";
import {createProject} from './utils/createProject.js'
export const creator = async (name: string, options: any): Promise<void> => {
  echo('创建项目')
  let cleared = await checkAndClearDir(name, options.force);
  if (cleared) {
    $.verbose = false;
    try {
      await createProject(name);
      // const privateNpmArr = await selectPrivateNpm();
      const projectInfo = await getProjectInfo();
      // await writePackageJson(name, projectInfo,privateNpmArr);
      await writePackageJson(name, projectInfo,[]);
      startProject(name);
    } catch (err) {
      exit(errorText(`❌ 初始化失败 ${err}`));
    }
    $.verbose = true;
  } else {
    exit(`👋 终止创建项目 see u ~`);
  }
};
