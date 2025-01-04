const { simpleGit } = require('simple-git');
const git = simpleGit();

async function syncToRemote() {
  try {
    const status = await git.status();
    console.log('当前状态:', status);
    
    // 确保在 main 分支上
    const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
    if (currentBranch.trim() !== 'main') {
      await git.checkout(['main']);
      // 如果 main 不存在，则创建它
      await git.checkoutLocalBranch('main');
    }
    
    await git.add('./*');
    await git.commit('update: vercel deployment setup');
    
    // 强制推送到 main
    await git.push('origin', 'main', ['--force']);
    
    console.log('推送完成！');
  } catch (error) {
    console.error('推送失败:', error);
    console.error('错误详情:', error.message);
  }
}

syncToRemote(); 