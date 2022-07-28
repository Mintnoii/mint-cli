import { echo, chalk } from "zx";
import figlet from "figlet";

// export const figletLog = (msg:string) => figlet.textSync(msg,{font:'big'})

export const showMintCli = () =>
  chalk.magenta.bold(
    figlet.textSync("M I N T - C L I", { font: "big" }) +
      "\n" +
      "🌿 Mint-Cli 前端项目 CLI 工具" + "\n"
  );

export const successText = (text: string) => chalk.green(text);
export const errorText = (text: string) => chalk.red(text);
export const warnText = (text: string) => chalk.yellow(text);
export const linkText = (text: string) => chalk.cyan(text);
export const noteText = (text: string) => chalk.gray(text);

export const successLog = (msg: string) => {
  echo(successText(msg));
};

export const errorLog = (msg: string) => {
  echo(errorText(msg));
};

export const warnLog = (msg: string) => {
  echo(warnText(msg));
};

export const markLog = (msg: string) => {
  echo(chalk.magenta(msg));
};

export const linkLog = (msg: string) => {
  echo(chalk.cyan(msg));
};

export const noteLog = (msg: string) => {
  echo(chalk.gray(msg));
};
