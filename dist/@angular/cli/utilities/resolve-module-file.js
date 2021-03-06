"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const dynamic_path_parser_1 = require("./dynamic-path-parser");
function resolveModulePath(moduleNameFromFlag, project, projectRoot, appConfig) {
    let baseModuleName = moduleNameFromFlag;
    let parentFolders = '';
    if (baseModuleName.includes(path.sep)) {
        const splitPath = baseModuleName.split(path.sep);
        baseModuleName = splitPath.pop();
        parentFolders = splitPath.join(path.sep);
    }
    if (baseModuleName.includes('.')) {
        baseModuleName = baseModuleName
            .split('.')
            .filter(part => part !== 'module' && part !== 'ts')
            .join('.');
    }
    const baseModuleWithFileSuffix = `${baseModuleName}.module.ts`;
    const moduleRelativePath = path.join(parentFolders, baseModuleWithFileSuffix);
    let fullModulePath = buildFullPath(project, moduleRelativePath, appConfig, projectRoot);
    if (!fs.existsSync(fullModulePath)) {
        const moduleWithFolderPrefix = path.join(parentFolders, baseModuleName, baseModuleWithFileSuffix);
        fullModulePath = buildFullPath(project, moduleWithFolderPrefix, appConfig, projectRoot);
    }
    if (!fs.existsSync(fullModulePath)) {
        throw 'Specified module does not exist';
    }
    return fullModulePath;
}
exports.resolveModulePath = resolveModulePath;
function buildFullPath(project, relativeModulePath, appConfig, projectRoot) {
    const parsedPath = dynamic_path_parser_1.dynamicPathParser(project, relativeModulePath, appConfig);
    const fullModulePath = path.join(projectRoot, parsedPath.dir, parsedPath.base);
    return fullModulePath;
}
//# sourceMappingURL=/users/mikkeldamm/forked-repos/angular-cli/utilities/resolve-module-file.js.map