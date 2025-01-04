const { simpleGit } = require('simple-git');
const path = require('path');
const fs = require('fs').promises;

// 初始化 git 客户端
const git = simpleGit();

// 添加状态检查函数
async function checkSyncStatus() {
  try {
    const status = await git.status();
    const remote = await git.remote(['get-url', 'origin']);
    
    return {
      isRepo: status.isValid(),
      remote: remote.trim(),
      behind: status.behind,
      ahead: status.ahead,
      modified: status.modified,
      isClean: status.isClean()
    };
  } catch (error) {
    console.error('Status check failed:', error);
    throw error;
  }
}

async function gitSyncMiddleware(req, res, next) {
  try {
    // 检查是否有未提交的更改
    const status = await git.status();
    
    if (status.modified.length > 0 || status.not_added.length > 0) {
      // 有本地更改，先提交
      await git.add('./*');
      await git.commit('auto: sync changes');
    }

    // 拉取远程更新
    await git.pull('origin', 'main');
    
    // 推送本地更改到远程
    await git.push('origin', 'main');

    next();
  } catch (error) {
    console.error('Git sync failed:', error);
    res.status(500).json({ error: 'Git sync failed' });
  }
}

// 导出两个函数
module.exports = {
  gitSyncMiddleware,
  checkSyncStatus
}; 