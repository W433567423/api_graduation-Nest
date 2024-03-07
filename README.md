## 简介

一整套中型系统, 在开发时追求的代码的可读性、规范性和可拓展性，该系统预计实现登录系统、用户权限系统、文件管理系统、web 代码编辑系统、脚本管理系统和可
视化系统等。

本项目是该系统的后端部分

## 技术栈

### 基础

- **语言** Node+TypeScript
- **包管理工具** npm/cnpm/yarn

- **基础框架** nestjs v^10.0
- **数据库** 腾讯mysql集群
- **API视图** swagger v^7.2
- **数据库对象关系映射** typeorm v^0.3
- **日志系统** winston v^3.11

### 开发

- **参数验证** 基于DTO的class-validator
- **图形验证码生成** svg-captcha v^1.4
- **跨域** cors
- **鉴权** jwt
- **对象存储** 腾讯cos

## 规范

- **eslint** ^8.42
- **lint-staged** v^15.2
- **husky** v^8.0
- **commitlint** v^18.6
- **prettier** v^3.0

## API风格

- 大体遵循RESTful风格

Rust 的轻量级 HTTP 框架，具有类似 REST 的功能。Rustful 的主要目的是为 HTTP 应用程序创建一个简单、模块化和非侵入性的基础。它主要具有无状态结构，这自然允许它既可以作为单个服务器运行，也可以作为集群中的多个实例运行。

## 开发方法

#### husky

- npx husky-init
- cpm i -g @nestjs/cli
- 新建控制器`nest g resource modules/<name> --no-spec`
