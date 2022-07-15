import { path, fs, $, echo, } from "zx";
import { spinner } from "zx/experimental";
import { warnLog, noteLog } from "./print.js";
import { isRemoveFolder, isStartProject } from "./prompts.js";

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
