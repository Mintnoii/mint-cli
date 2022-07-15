
import { fetch } from 'zx';
import {needPrivateNpm, outputPrivateNpm} from './prompts.js';
import { successLog, noteLog } from './print.js';
export const selectXmovNpm = async () => {
    const { isNeedPrivateNpm } = await needPrivateNpm();
    if (isNeedPrivateNpm) {
      let allRepos: any = await fetch(
        "https://npm.xmov.ai/-/verdaccio/data/packages"
      ).then((res) => res.json());
      // 获取 verdaccio 的所有包信息并重组
      const utilsRepos = allRepos?.filter((repo:any) => repo?.repository?.utils) || [];
      const xmovNpms = utilsRepos.map(({ name, version, description }) => ({
        title: name,
        value: { name, version },
        description,
      }))
      const { xmovNpm } = await outputPrivateNpm(xmovNpms);
      xmovNpm.length
        ? successLog(
            `选择安装的模块： ${xmovNpm.map(({ name }) => name).join(" ")}`
          )
        : noteLog(`没有选择 xmov 工具模块`);
      return xmovNpm;
    }
    return [];
  };