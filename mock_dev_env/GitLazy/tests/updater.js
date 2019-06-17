'use strict';
let assert = require('assert');
let shell = require('shelljs');

let updater = require('../components/updater');

const prodSSH = "prod@alexbarkell.com";


describe('updater', (done) => {
  it('should get the parent project name', () => {
    let projectName = updater.getProjectName();
    let expectedName = 'mock_dev_env';
    assert.equal(projectName, expectedName);
  });

  it('should get the remote version of its parent project', async () => {
    const prodSSH = "prod@alexbarkell.com";
    // setup remote version
    shell.exec("ssh " + prodSSH + " 'rm -rf ~/mock_dev_env && "
      + "mkdir ~/mock_dev_env && echo v0.0.2 > ~/mock_dev_env/.version'")

    const remotePath = "~/" + updater.getProjectName()
    let version = await updater.getRemoteVersion(prodSSH, remotePath);
    let expectedVersion = 'v0.0.2';
    assert.equal(version, expectedVersion);
  });

  it('should get the local version of its parent project', async () => {
    // setup local version
    shell.exec("cd ../../mock_dev_env && echo v0.0.1 > .version");

    const localPath = __dirname + "/../../";
    let version = await updater.getLocalVersion(localPath);
    let expectedVersion = 'v0.0.1';
    assert.equal(version, expectedVersion);
  });

  it('should backup the remote project', async () => {
    shell.exec("ssh " + prodSSH + " 'rm -rf ~/mock_dev_env && "
      + "rm -rf ~/mock_dev_env_versions && "
      + "mkdir ~/mock_dev_env && echo v3.1.459 > ~/mock_dev_env/.version'")

    const projectName = updater.getProjectName();
    const projectPath = "~/" + projectName

    await updater.backupRemoteProject(prodSSH, projectName, projectPath);

    let version = shell.exec("ssh " + prodSSH
      + " 'cd ~/mock_dev_env_versions/mock_dev_env_v3.1.459 && cat .version'");
    version = version["stdout"].replace("\n", "");

    const expectedVersion = "v3.1.459"
    assert.equal(version, expectedVersion);
  });

  it('should update the remote project', async () => {
    // setup local and remote versions
    shell.exec("cd ../../mock_dev_env && echo v3.2.0 > .version");
    shell.exec("ssh " + prodSSH + " 'rm -rf ~/mock_dev_env && "
      + "mkdir ~/mock_dev_env && echo v3.1.459 > ~/mock_dev_env/.version'")

    // check initalization worked
    const localPath = __dirname + "/../../";
    const remotePath = "~/" + updater.getProjectName()
    let initalLocalVersion = await updater.getLocalVersion(localPath);
    let initalRemoteVersion = await updater.getRemoteVersion(prodSSH, remotePath);

    let expectedInitalLocalVersion = 'v3.2.0';
    let expectedInitalRemoteVersion = 'v3.1.459';

    assert.equal(initalLocalVersion, expectedInitalLocalVersion);
    assert.equal(initalRemoteVersion, expectedInitalRemoteVersion);

    const projectName = updater.getProjectName();
    const projectPath = "~/" + projectName;


    const localProjectPath = "~/Desktop/code-test/mock_dev_env/.";

    await updater.updateRemoteProject(prodSSH, localProjectPath, projectPath);

    let remoteVersion = await updater.getRemoteVersion(prodSSH, projectPath);
    let expectedRemoteVersion = expectedInitalLocalVersion;
    assert.equal(remoteVersion, expectedRemoteVersion);
  });

  it('should backup the local project', async () => {
    shell.exec("rm -rf ~/mock_dev_env_2 && "
      + "rm -rf ~/mock_dev_env_2_versions")


    await shell.exec("mkdir ~/mock_dev_env_2 && echo v3.1.459 > ~/mock_dev_env_2/.version");

    const projectName = "mock_dev_env_2";
    const projectPath = "~/mock_dev_env_2";

    await updater.backupLocalProject(projectName, projectPath);

    let version = shell.exec("cd ~/mock_dev_env_2_versions/mock_dev_env_2_v3.1.459/ && cat .version");
    version = version["stdout"].replace("\n", "");

    const expectedVersion = "v3.1.459";
    assert.equal(version, expectedVersion);
  });

  it('should update the local project', async () => {
    // setup local and remote versions
    shell.exec("cd ../../mock_dev_env && echo v3.1.4 > .version");
    shell.exec("ssh " + prodSSH + " 'rm -rf ~/mock_dev_env && "
      + "mkdir ~/mock_dev_env && echo v3.1.459 > ~/mock_dev_env/.version'");

    // check initalization worked
    const localPath = __dirname + "/../../";
    const remotePath = "~/" + updater.getProjectName()

    let initalLocalVersion = await updater.getLocalVersion(localPath);
    let initalRemoteVersion = await updater.getRemoteVersion(prodSSH, remotePath);

    let expectedInitalLocalVersion = 'v3.1.4';
    let expectedInitalRemoteVersion = 'v3.1.459';

    assert.equal(initalLocalVersion, expectedInitalLocalVersion);
    assert.equal(initalRemoteVersion, expectedInitalRemoteVersion);

    const localProjectPath = "~/Desktop/code-test/mock_dev_env_2/";
    const projectName = updater.getProjectName();
    const remoteProjectPath = "~/" + projectName + '/.';

    await updater.updateLocalProject(prodSSH, localProjectPath, remoteProjectPath);

    let localVersion = await updater.getLocalVersion(__dirname
      + "/../../../mock_dev_env_2/");
    let expectedLocalVersion = expectedInitalRemoteVersion;
    assert.equal(localVersion, expectedLocalVersion);

  });
});
