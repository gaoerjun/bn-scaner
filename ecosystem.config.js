module.exports = {
  apps: [{
    name: "binance-monitor",
    script: "./index.js",
    watch: false,
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    // 自动重启配置
    autorestart: true,
    max_restarts: 1000,
    // 错误日志文件
    error_file: "logs/err.log",
    // 输出日志文件
    out_file: "logs/out.log",
    // 日志时间格式
    time: true,
    // 合并日志
    merge_logs: true,
    // 日志文件最大大小
    max_size: "20M",
    // 日志文件保留天数
    max_days: "14d"
  }]
} 