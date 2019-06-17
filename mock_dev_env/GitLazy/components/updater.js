'use strict';

let fs = require('fs');
let shell = require('shelljs');
var path = require('path');

module.exports = {
  getProjectName: function async () {
    let projectName = __dirname.split('/');
    projectName = projectName[projectName.length - 3];
    return projectName;
  },
  getRemoteVersion: function async (remoteSSH, projectPath) {
    let version = shell.exec("ssh " + remoteSSH + " 'cd " + projectPath
      + " && cat .version'");
    version = version["stdout"].replace("\n", "");
    return version;
  },
  getLocalVersion: function async (projectPath) {
    let version = shell.exec("cd " + projectPath + " && cat .version");
    version = version["stdout"].replace("\n", "");
    return version;
  },
  backupRemoteProject: function async (remoteSSH, projectName, projectPath) {
    // move current to backup folder
    shell.exec("ssh " + remoteSSH + " 'mkdir " + projectPath + "_versions/'")
    shell.exec("ssh " + remoteSSH + " 'mv " + projectPath + " " + projectPath
      + "_versions/" + projectName + "_`cat " + projectPath + "/.version`'");
  },
  backupLocalProject: function async (projectName, projectPath) {
      shell.exec("mkdir " + projectPath + "_versions")
      shell.exec("cp -a " + projectPath + "/. " + projectPath
        + "_versions/" + projectName + "_`cat " + projectPath + "/.version`");
  },
  updateRemoteProject: function async (remoteSSH, localPath, remotePath) {
    shell.exec("rsync -av " + localPath + " " + remoteSSH + ":" + remotePath);
  },
  updateLocalProject: function async (remoteSSH, localPath, remotePath) {
    shell.exec("rsync -av " + remoteSSH + ":" + remotePath + " " + localPath);
  },
}
