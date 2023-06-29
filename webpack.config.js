module.exports = {
  // ... 其他配置
  output: {
    publicPath: process.env.NODE_ENV === 'production'
      ? '/my-app/'  // 修改为你的 Github 仓库的名称
      : '/'
  },
  // ... 其他配置
}
