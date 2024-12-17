#!/bin/bash

# 确保日志目录存在
mkdir -p logs

# 启动应用
pm2 start ecosystem.config.js

# 保存 PM2 进程列表
pm2 save

# 设置开机自启
pm2 startup 