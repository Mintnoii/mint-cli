// 具体交互内容
import { echo } from "zx";
import prompts from "prompts";
import { loadDefaultTemplates, loadCustomTemplates } from "./load.js";
import { noteLog, warnLog } from "./print.js";

const onCancel = prompt => {
  echo('👋 Bye~');
  process.exit(1);
}

// 获取项目模板
export const selectProjectTmpl = async () => {
  const allTmpls = { ...loadDefaultTemplates(), ...loadCustomTemplates() };
  return prompts({
    type: "autocomplete",
    name: "templateUrl",
    message: "请选择模板，进行项目初始化：",
    choices: Object.keys(allTmpls).map((key) => {
      return {
        title: key,
        value: allTmpls[key]?.url,
        description: allTmpls[key]?.desc,
      };
    }),
  }, { onCancel });
}

export const getTmplInfo = async () => {
  return await prompts([
    {
      type: "text",
      name: "name",
      message: "请输入模板名称(必填)：",
    },
    {
      type: "text",
      name: "url",
      message: "请输入模板 git 地址(必填)：",
    },
    {
      type: "text",
      name: "author",
      message: "请输入模板作者：",
    },
    {
      type: "text",
      name: "desc",
      message: "请输入模板描述：",
    },
  ], { onSubmit: (prompt, answer) => {
    const { name } = prompt;
    if(!answer){
      if(["name", "url"].includes(name)){
        warnLog(`❌ 模板${name === 'name'?"名称":"地址"}为必填项！`);
        process.exit(1);
      }
    }
    if (name === 'url' && !/^(git@|https:).+\.git$/.test(answer)) {
      warnLog(`❌ 模板仓库的地址不合法，请检查后重新输入！`);
      noteLog("模板仓库地址必须以 git@ 或者是 https: 开头, 并且必须以 .git 结尾");
      process.exit(1);
    }
    // 还可以加入一个验证模板名称是否已经存在的功能
    return false;
  },  onCancel });
}

export const confirmCustomTmpl = async (tmplName:string) => {
  return await prompts({
    type: "toggle",
    name: "isRemove",
    message: `确定要删除自定义模板 ${tmplName} 吗？`,
    initial: false,
    active: "是",
    inactive: "否",
  }, { onCancel });
}

export const isRemoveFolder = async () => {
  return prompts({
    type: "toggle",
    name: "removeFolder",
    message: "请选择是否移除该文件夹",
    initial: false,
    active: "是",
    inactive: "否",
  },{onCancel});
}

// 获取项目依赖的 UI 框架
export const getUILib = async () => {
  return prompts({
    name: "UIComponents",
    type: "select",
    message: "请选择 UI 框架：",
    choices: [
      { title: "Ant Design Vue", value: "antd" },
      { title: "Element Plus", value: "element" },
      { title: '暂不需要', value: '' },
    ],
  },{ onCancel });
}

export const needPrivateNpm = async () => {
  return prompts({
    type: "toggle",
    name: "isNeedPrivateNpm",
    message: "是否需要安装公司私有 npm 依赖包？",
    initial: false,
    active: "是",
    inactive: "否",
  },{onCancel});
}

// 选择私有 npm 包
export const outputPrivateNpm = async (npmOptions:any) => {
  return prompts({
    type: "multiselect",
    name: "privateNpm",
    message: "请选择需要安装的模块",
    choices: npmOptions,
    instructions: false,
    hint: "↑/↓ 选择，←/→/[space] 切换选中，a 切换全选，enter 完成选择",
  },{onCancel});
}

// 选择内置功能特性
export const selectBuiltInFeatures = async () => {
  return prompts({
    type: "multiselect",
    name: "builtInFeatures",
    message: "请选择开箱即用的功能特性",
    choices: [
      { title: 'VueUse', value: 'VueUse', description: '非常使用的 Composition Api 工具集' },
      { title: '文件路由', value: 'FileRoute', description: '基于视图文件结构，自动生成项目路由与布局系统' },
    ],
    instructions: false,
    hint: "↑/↓ 选择，←/→/[space] 切换选中，a 切换全选，enter 完成选择",
  },{onCancel});
}

export const projectPrompt = [
  {
    type: "text",
    name: "author",
    message: "请输入项目作者：",
  },
  {
    type: "text",
    name: "description",
    message: "请输入项目描述：",
  },
  {
    type: "text",
    name: "version",
    message: "请输入项目版本：",
    initial: "0.0.1",
  },
  {
    type: "text",
    name: "git",
    message: "请输入项目 git 地址：",
  },
];

export const getProjectInfo = async () => {
  return prompts(projectPrompt, { onCancel });
}

// 是否启动项目
export const isStartProject = async () => {
  return prompts({
    type: "toggle",
    name: "start",
    message: `项目创建成功，是否现在启动？`,
    active: "立即启动",
    inactive: "稍后再说",
    initial: false,
  },{onCancel});
}