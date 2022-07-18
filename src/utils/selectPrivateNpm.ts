
import { fetch } from 'zx';
import {needPrivateNpm, outputPrivateNpm} from './prompts.js';
import { successLog, noteLog } from './print.js';
export const selectXmovNpm = async () => {
    const { isNeedPrivateNpm } = await needPrivateNpm();
    if (isNeedPrivateNpm) {
      let allRepos: any = await fetch(
        // 这里是私有的 npm packages 地址
        ''
      ).then((res) => res.json());
      // 获取 verdaccio 的所有包信息并重组
      const utilsRepos = allRepos?.filter((repo:any) => repo?.repository?.utils) || [];
      const theNpms = utilsRepos.map(({ name, version, description }) => ({
        title: name,
        value: { name, version },
        description,
      }))
      const { privateNpm } = await outputPrivateNpm(theNpms);
      privateNpm.length
        ? successLog(
            `选择安装的模块： ${privateNpm.map(({ name }) => name).join(" ")}`
          )
        : noteLog(`没有选择私有 npm 工具模块`);
      return privateNpm;
    }
    return [];
  };