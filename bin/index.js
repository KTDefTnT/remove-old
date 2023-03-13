#! /usr/bin/env node
/**
 * process.argv
 * process.argv[0] :node执行文件路径
 * process.argv[1] :正在执行的JavaScript文件的路径
 * process.argv[3] :参数
 */

// 项目路径
const programPath = process.env.PWD;
const fs = require("fs");
const packageConfigration = require(`${programPath}/package.json`);
const { remove } = packageConfigration;

console.log("deleteFiles", RegExp(remove?.deleteFiles));
console.log("configration", typeof remove?.deleteFiles);

const ignoreList = ["node_modules", "dist", "README.md", ".git", ".husky"];

function deleteAll(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    console.log(path, files);
    files.forEach((file) => {
      const currPath = `${path}/${file}`;
      // 删除文件和文件夹的操作不一样
      if (fs.statSync(currPath).isDirectory()) {
        // 遍历 recurse继续删除
        deleteAll(currPath);
      } else {
        // 如果是文件 则直接删除
        fs.unlinkSync(currPath);
      }
    });

    // path下所有文件删除成功后再删除自身 - 只能删除空文件夹
    fs.rmdirSync(path);
  }
}

function handleDelete(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = `${dir}/${file}`;
    const fileStat = fs.statSync(filePath);
    // 判断当前文件/文件夹是否需要处理
    if (!ignoreList.includes(file)) {
      // 如果时文件夹，则需要遍历处理
      if (fileStat.isDirectory()) {
        // 仅删除匹配为oldPage的文件夹
        if (/(.*)-oldPage/g.test(file)) {
          deleteAll(filePath);
        } else {
          // recure 深度遍历
          handleDelete(filePath);
        }
      } else if (/(.*)-oldPage/g.test(file)) {
        // 匹配中的文件夹  直接删除
        fs.unlinkSync(filePath);
      }
    }
  });
}

handleDelete(programPath);
