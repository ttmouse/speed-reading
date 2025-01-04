const { simpleGit } = require('simple-git');
const git = simpleGit();

async function getChangesSummary() {
  const status = await git.status();
  const changes = [];
  
  if (status.modified.length) changes.push(`修改: ${status.modified.join(', ')}`);
  if (status.created.length) changes.push(`新增: ${status.created.join(', ')}`);
  if (status.deleted.length) changes.push(`删除: ${status.deleted.join(', ')}`);
  if (status.renamed.length) changes.push(`重命名: ${status.renamed.map(f => `${f.from}->${f.to}`).join(', ')}`);
  
  return changes.join('; ') || '更新文件';
}

async function syncToRemote() {
  try {
    const status = await git.status();
    console.log('当前状态:', status);
    
    // 确保在 main 分支上
    const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
    if (currentBranch.trim() !== 'main') {
      await git.checkout(['main']);
      await git.checkoutLocalBranch('main');
    }
    
    // 获取修改摘要
    const changeMsg = await getChangesSummary();
    console.log('变更摘要:', changeMsg);
    
    await git.add('./*');
    await git.commit(`update: ${changeMsg}`);
    
    await git.push('origin', 'main', ['--force']);
    
    console.log('推送完成！');
  } catch (error) {
    console.error('推送失败:', error);
    console.error('错误详情:', error.message);
  }
}

syncToRemote(); 