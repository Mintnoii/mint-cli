import { path, fs, $, echo, } from "zx";
import { spinner } from "zx/experimental";
import {
  warnLog,
  markLog,
  linkText,
  noteText,
  noteLog,
  successLog,
} from "./print.js";
import { isRemoveFolder, isStartProject } from "./prompts.js";
import { loadDefaultTemplates, loadCustomTemplates, customTmplJSONPath } from "./load.js";

/**
 * 列出所有项目模板
 */
export const listTemplate = () => {
  markLog("默认模板：");
  Object.entries(loadDefaultTemplates()).forEach(
    ([key, value]: any, index: number) => {
      echo(`${index + 1}. ${linkText(key)} ${noteText(value)}`);
    }
  );
  markLog("自定义模板：");
  Object.entries(loadCustomTemplates()).forEach(
    ([key, value]: any, index: number) => {
      echo(`${index + 1}. ${linkText(key)} ${noteText(value)}`);
    }
  );
};

/**
 * 添加自定义模板
 * @param template_name 模板名称
 * @param git_url 模板地址
 * @returns
 */
// export const addTemplate = async (template_name: string, git_url: string) => {
//   // 理想正则 /^(git@|https:).+\.git$/
//   if (!/^frontend\/.+\.git$/.test(git_url)) {
//     warnLog(`👀 模板仓库的地址不合法，请检查后重新输入！`);
//     noteLog("git_url 必须以 frontend/ 开头, 并且必须以 .git 结尾");
//     // noteLog("git_url 必须以 git@ 或者是 https: 开头, 并且必须以 .git 结尾");
//     return;
//   }
//   // 还可以加入一个验证模板名称是否已经存在的功能
//   await fs.writeFileSync(
//     customTmplJSONPath,
//     JSON.stringify(
//       { ...loadCustomTemplates(), [template_name]: git_url },
//       null,
//       "\t"
//     )
//   );
//   successLog(`🎉 模板 ${template_name} 添加成功！`);
//   noteLog(`你可以执行 xmov init 并选择该模板，开始初始化项目`);
// };

/**
 * 删除自定义模板
 * @param template_name 模板名称
 * @param options 项目初始化选项 force:true 强制初始化
 * @returns
 */
// export const removeTemplate = async (template_name: string, options: any) => {
//   const customTemplates = loadCustomTemplates();
//   if (!customTemplates[template_name]) {
//     warnLog(`🧐 没有找到自定义模板 ${template_name}，请确认模板名称是否正确`);
//     return;
//   }
//   if (!options.force) {
//     const { ok } = await prompts({
//       type: "toggle",
//       name: "ok",
//       message: `确定要删除自定义模板 ${template_name} 吗？`,
//       initial: false,
//       active: "yes",
//       inactive: "no",
//     });
//     if (!ok) {
//       warnLog("取消删除");
//       return;
//     }
//   }
//   delete customTemplates[template_name];
//   await fs.writeFileSync(
//     customTmplJSONPath,
//     JSON.stringify(customTemplates, null, "\t")
//   );
//   successLog(`🎉 模板 ${template_name} 删除成功！`);
// };

/**
 * 检查是否已有同名文件夹 并询问是否删除
 * @param name 文件夹名称
 * @param force 是否强制删除
 * @returns {Promise<boolean>} 是否已清空
 */
export const checkAndClearDir = async (
  name: string,
  force: boolean
): Promise<boolean> => {
  const targetDir = path.resolve(process.cwd(), name || ".");
  // 判断当前路径下是否已经存在文件夹
  if (fs.pathExistsSync(targetDir)) {
    warnLog(`🧐 当前路径下已存在 ${name} 文件夹`);
    if (force) {
      await spinner("清理文件夹...", () => fs.remove(targetDir));
      warnLog(`🗑 原有文件夹已被移除`);
      return true;
    } else {
      const { removeFolder } = await isRemoveFolder();
      if (removeFolder) {
        await spinner("清理文件夹...", () => fs.remove(targetDir));
        warnLog(`🗑 原有文件夹已被移除`);
        return true;
      } else {
        return false;
      }
    }
  }
  return true;
};

// 把采集到的用户数据解析替换到 package.json 文件中
/**
 *
 * @param project_name 项目名称
 * @param answers 项目信息 通过 prompts 获取
 * @param xmovNpm 需要安装的 xmov-npm 包
 */
export const writePackageJson = async (
  project_name: string,
  answers: any,
  xmovNpm: any[]
) => {
  const targetPath = `${process.cwd()}/${project_name}/package.json`;
  const tmpJson = await fs.readJsonSync(targetPath);
  const { dependencies, ...rest } = tmpJson;
  const result = {
    ...rest,
    ...answers,
    name: project_name,
    // 将对象数组 xmovNpm [{name:version}] 放进 dependencies 字段
    dependencies: Object.assign(dependencies, xmovNpm.reduce((acc, { name, version }) => {
      acc[name] = version;
      return acc;
    }, {}))
  };
  await fs.writeFileSync(targetPath, JSON.stringify(result, null, "\t"));
};

/**
 * 启动项目
 * @param project_name 项目文件夹名
 */
export const startProject = async (project_name: string) => {
  const { start } = await isStartProject();
  // 这里还要判断项目的具体启动命令
  if (start) {
    $.verbose = true;
    warnLog("⏳ 下载依赖并启动项目，请耐心等待...")
    await $`cd ${project_name} && yarn && yarn run dev`
    $.verbose = false;
    return;
  }
  noteLog(`进入项目文件夹 cd ${project_name}`)
  noteLog(`安装依赖，启动项目 yarn && yarn run dev`)
};

/**
 * 退出程序
 * @param msg 退出消息
 */
export const exit = async (msg: string) => {
  echo(msg);
  process.exit(1);
};
