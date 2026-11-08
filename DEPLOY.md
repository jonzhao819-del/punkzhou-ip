# GitHub Pages 发布

这个目录本身就是可发布的静态站点，不需要构建。

## 最省事的方式

1. 打开 GitHub，新建 repository，名称例如 `punkzhou-ip`，可见性选 **Public**。
2. 在仓库首页点 **Add file → Upload files**，把本目录的全部文件拖进去，提交。
3. 进入 **Settings → Pages**：
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. 保存后等待 30–60 秒。页面地址会显示在 Pages 设置顶部：
   `https://jonzhao819-del.github.io/punkzhou-ip/`

`.nojekyll` 已经放好，GitHub 不会再用 Jekyll 处理这些文件。

## 如果已经有仓库

把本目录内容放到仓库根目录，或把本目录改名为 `docs` 后在 Pages 里选择 `/docs`。不要只上传 `index.html`，`assets/`、`styles.css`、`app.js` 也要一起上传。

## 自定义域名

在 Pages 设置里填 Custom domain，并按 GitHub 提示在域名服务商处添加 CNAME 记录。开启 HTTPS 后再对外分享。
