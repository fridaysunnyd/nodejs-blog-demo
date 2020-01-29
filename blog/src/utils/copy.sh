#!/bin/sh
cd /Users/dangweijia/前端项目/nodejs-blog-demo/blog/logs
cp access.log $(date +%Y-%m-%d).access.log
echo "" > access.log