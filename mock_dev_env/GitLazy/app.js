'use strict';
const updater = require("./components/updater.js");

const pullConfig = {
  ssh: "foo@bar.com",
  localPath: "~/Desktop/code-test/mock_dev_env_2/",
  remotePath: "~/mock_dev_env/."
}

const pushConfig = {
  ssh: "foo@bar.com",
  localPath: "~/Desktop/code-test/mock_dev_env/.",
  remotePath: "~/mock_dev_env"
}

module.exports = {
  pull: () => updater.updateLocalProject(pullConfig.ssh, pullConfig.localPath, pullConfig.remotePath),
  push: () => updater.updateRemoteProject(pushConfig.ssh, pushConfig.localPath, pushConfig.remotePath)
}
