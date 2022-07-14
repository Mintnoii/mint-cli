#! /usr/bin/env node
import { program } from "commander";
import { echo } from "zx";
// import { init } from "./init.js";
// import {creator} from "./creator.js";
import { showXmovCli, errorText } from "./utils/print.js";
// import { listTemplate, addTemplate, removeTemplate } from "./utils/index.js";
import { listTemplate } from "./utils/tmpl.js";
// import {loadPackageJson} from "./utils/load.js";

program.addHelpText("before", showXmovCli());
program.configureOutput({
  // writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
  // writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
  // 将错误高亮显示,使输出变得容易区分
//   outputError: (str, write) => write(errorText(str)),
});

program
  .name("xmov")
//   .version(loadPackageJson().version, "-v, --version", "查看当前版本")
  .option("-h, --help", "显示命令帮助");

program
  .command("init <project_name>")
  .alias("i")
  .description("🚀 使用模板初始化项目")
  .option("-f, --force", "覆盖项目同名文件夹，强制初始化")
  .action((project_name, options) => echo(project_name, options));

program
  .command("list")
  .alias("ls")
  .description("👀 查看当前所有模板")
  .action(() => listTemplate());

program
  .command("add-tmpl <template_name> <git_url>")
  .description("📥 添加自定义模板：模板名 模版地址")
//   .action((template_name, git_url) => addTemplate(template_name, git_url));

program
  .command("rm-tmpl <template_name>")
  .description("📤 删除自定义模板：模板名")
  .option("-f, --force", "强制删除")
//   .action((template_name, options) => removeTemplate(template_name, options));

program
  .command("create <app-name>")
  .alias("c")
  .description("🧩 创建一个新项目")
  .option("-f, --force", "覆盖项目同名文件夹，强制初始化")
  .action((name, options) => echo(name, options));
  // await hasDir(name);
// 必须放到最后一行用于解析
program.parse(process.argv);
