const { parallel, series } = require("gulp");
const fs = require("fs");
const { Buffer } = require("buffer");
const path = require("path");
const { exec, spawn } = require("child_process");

let electronProcess;
function runElectron() {
  electronProcess = spawn("yarn", ["electron"], {
    shell: true,
  });
  electronProcess.on("close", () => {
    if (webpackProcess) {
      webpackProcess.kill("SIGKILL");
    }
  });
  electronProcess.stdout.pipe(process.stdout);
  electronProcess.stderr.pipe(process.stderr);
}

function cleanFolder() {
  fs.readdirSync("./src/dist").forEach((file) => {
    fs.unlinkSync(`./src/dist/${file}`);
  });
  return Promise.resolve("resolve");
}

let webpackProcess;
function runWebpack() {
  webpackProcess = spawn("webpack", ["--watch"], {
    shell: true,
  });
  webpackProcess.stdout.on("data", () => {
    const now = new Date();
    console.log(
      `Webpack loaded - ${now.getHours()}:${now.getMinutes()}:${
        (now.getSeconds() < 10 ? "0" : "") + now.getSeconds()
      }`
    );
  });
  webpackProcess.stderr.pipe(process.stderr);
  webpackProcess.on("exit", (code, signal) => {
    process.exit();
  });
}

exports.clean = cleanFolder;
exports.webpack = runWebpack;
exports.default = series(cleanFolder, parallel(runWebpack, runElectron));
