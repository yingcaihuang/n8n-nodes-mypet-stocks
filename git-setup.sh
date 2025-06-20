#!/bin/bash

# MyPet Stocks n8n 节点 Git 设置脚本

echo "🔧 初始化 Git 仓库..."

# 检查是否已经是 Git 仓库
if [ -d ".git" ]; then
    echo "⚠️  Git 仓库已存在"
    read -p "是否要重新初始化？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf .git
        echo "🗑️  已删除现有 Git 仓库"
    else
        echo "❌ 操作已取消"
        exit 0
    fi
fi

# 初始化 Git 仓库
git init
echo "✅ Git 仓库初始化完成"

# 添加所有文件到暂存区（.gitignore 会自动过滤不需要的文件）
git add .
echo "✅ 文件已添加到暂存区"

# 显示将要提交的文件
echo ""
echo "📋 将要提交的文件:"
git status --short

echo ""
echo "🚫 被忽略的文件:"
git status --ignored --short

# 提交初始版本
echo ""
read -p "请输入提交信息 (默认: 'Initial commit: MyPet Stocks n8n node v1.0.0'): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="Initial commit: MyPet Stocks n8n node v1.0.0"
fi

git commit -m "$commit_message"
echo "✅ 初始提交完成"

# 设置默认分支为 main
git branch -M main
echo "✅ 默认分支设置为 main"

echo ""
echo "🎯 下一步操作建议:"
echo "1. 在 GitHub/GitLab 等平台创建远程仓库"
echo "2. 添加远程仓库地址:"
echo "   git remote add origin https://github.com/your-username/n8n-nodes-mypet-stocks.git"
echo "3. 推送到远程仓库:"
echo "   git push -u origin main"
echo ""
echo "📦 发布到 npm:"
echo "1. 登录 npm: npm login"
echo "2. 发布包: npm publish"
echo ""
echo "🎉 Git 设置完成！"
