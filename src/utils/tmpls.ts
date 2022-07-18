// 模板相关的方法
import { fs, $, echo, } from "zx";
import { spinner } from "zx/experimental";
import Table from 'cli-table3';
import {
  warnLog,
  linkText,
  linkLog,
  noteLog,
  successLog,
} from "./print.js";
import {getTmplInfo, confirmCustomTmpl, selectProjectTmpl} from './prompts.js';
import { loadDefaultTemplates, loadCustomTemplates, customTmplJSONPath } from "./load.js";


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

export const addCustomTmpl = async () => {
  const tmplInfo = await getTmplInfo();
  const {name, ...rest} = tmplInfo;
  await fs.writeFileSync(
    customTmplJSONPath,
    JSON.stringify(
      { ...loadCustomTemplates(), [name]: rest },
      null,
      "\t"
    )
  );
  successLog(`🎉 模板 ${name} 添加成功！`);
  noteLog(`你可以执行 mint init 并选择该模板，开始初始化项目`);
};
  
export const rmCustomTmpl = async (template_name: string, options: any) => {
  const customTemplates = loadCustomTemplates();
  if (!customTemplates[template_name]) {
    warnLog(`🧐 自定义模板中没有找到 ${template_name}，请确认模板名称是否正确`);
    return;
  }
  if (!options.force) {
    const { isRemove } = await confirmCustomTmpl(template_name);
    if (!isRemove) {
      warnLog("取消删除");
      return;
    }
  }
  delete customTemplates[template_name];
  await fs.writeFileSync(
    customTmplJSONPath,
    JSON.stringify(customTemplates, null, "\t")
  );
  successLog(`🎉 模板 ${template_name} 删除成功！`);
};

export const fetchTmpl = async (project_name: string) => {
  const {templateUrl} = await selectProjectTmpl();
  // 这里只会把默认分支 clone下来，其他远程分支并不在本地
  await spinner(
    "下载项目模板...",
    () => $`git clone --depth 1 ${templateUrl} ${project_name}`
  );
  successLog(`🎉 模板下载完成`);
  linkLog(`🗂 ${process.cwd()}/${project_name}`);
}