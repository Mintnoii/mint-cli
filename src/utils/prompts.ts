// 具体交互内容
import { echo } from "zx";
import prompts from "prompts";
import { loadDefaultTemplates } from "./load.js";

const defaultTemplates = loadDefaultTemplates();
const onCancel = prompt => {
  echo('👋 Bye~');
  process.exit(1);
}
// 获取项目模板
export const getProjectTmpl = async () => {
  return prompts({
    type: "autocomplete",
    name: "templateUrl",
    message: "请选择模板，进行项目初始化：",
    choices: templatesArr,
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

// 是否需要安装 xmov npm 包  
export const needXmovNpm = async () => {
  return prompts({
    type: "toggle",
    name: "isNeedXmovNpm",
    message: "是否需要安装 xmov 依赖包？",
    initial: false,
    active: "是",
    inactive: "否",
  },{onCancel});
}
// 选择 xmov npm 包
export const outputXmovNpm = async (npmOptions:any) => {
  return prompts({
    type: "multiselect",
    name: "xmovNpm",
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
// 将 defaultTemplates 转换为数组
const templatesArr = Object.keys({ ...defaultTemplates }).map((key) => {
  return {
    title: key,
    value: defaultTemplates[key],
  };
});