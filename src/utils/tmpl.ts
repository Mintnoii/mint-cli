// 模板相关的方法
import { path, fs, $, echo, } from "zx";
import { spinner } from "zx/experimental";
import Table from 'cli-table3';
import {
  warnLog,
  markLog,
  linkText,
  noteText,
  noteLog,
  successLog,
} from "./print.js";
import { loadDefaultTemplates, loadCustomTemplates, customTmplJSONPath } from "./load.js";
/**
 * 列出所有项目模板
 */
 export const listTemplate = () => {
  let table = new Table({
    head: ['模板名称', '简介', '作者','仓库', '分类'],
    style: {
      head: ['green'],
      // border: [], 
    },
    colWidths: [null, 35, null,30, null], 
    wordWrap: true,
    wrapOnWordBoundary: false,
  });
    Object.entries(loadDefaultTemplates()).forEach(
      ([name, {url, desc, author}]: any) => {
        table.push(
          [linkText(name),desc,author, url, '内置'],
        );
      }
    );
    Object.entries(loadCustomTemplates()).forEach(
      ([name, {url, desc, author}]: any) => {
        table.push(
          [linkText(name),desc,author, url, '自定义'],
        );
      }
    );
    echo(table.toString())
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