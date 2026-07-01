# PanicTab Chrome Web Store 上架材料

本文档中的内容可以直接复制到 Chrome Web Store Developer Dashboard。建议公开上架时将 PanicTab 定位为“标签页整理与快速遮挡工具”，不要在商店文案中过度强调“伪装浏览器崩溃”，以降低被判定为误导性体验的风险。

## 基本信息

扩展名称：

```text
PanicTab
```

一句话简介：

```text
一键整理标签页并打开预设遮挡页面，适合屏幕共享、公共空间和临时隐私保护。
```

推荐类别：

```text
Productivity / 效率
```

推荐语言：

```text
中文（简体）和英文。扩展界面第一版支持简体中文、英文、日文、韩文、德文和法文。
```

官方网站：

```text
填写你的项目主页、GitHub 仓库或产品介绍页 URL。
```

支持联系邮箱：

```text
填写你的开发者联系邮箱。
```

隐私政策 URL：

```text
填写你发布后的隐私政策页面 URL。可使用 docs/privacy-policy.zh-CN.md 的内容发布为网页。
```

## 详细说明

```text
PanicTab 是一款轻量级标签页整理与快速遮挡工具。它适合屏幕共享前、开放办公区、咖啡馆、图书馆等需要快速保护屏幕内容的场景。

当有人靠近屏幕、会议即将开始共享，或你想在公共空间临时保护浏览器内容时，可以通过双击 Ctrl、扩展工具栏按钮或 Chrome 原生快捷键触发 PanicTab。扩展会把当前窗口中可整理的标签页归入一个折叠的 Chrome 标签组，并打开用户选择的遮挡页面。鼠标左键三连击触发可在设置页手动启用，默认关闭。

典型场景：
- 有人靠近屏幕时，一键收起标签页并切换到预设遮挡页面
- 远程会议或现场演示前，快速清理杂乱浏览器窗口
- 在咖啡馆、图书馆、开放办公区等公共空间减少屏幕内容被旁人看到的风险
- 查看个人网页、后台页面、邮件或资料时，快速切换到更适合展示的页面

主要功能：
- 快速整理当前窗口标签页
- 将标签页归入一个折叠的 Chrome 标签组
- 默认支持网页内双击 Ctrl 触发
- 可手动启用鼠标左键三连击触发
- 支持工具栏按钮触发
- 支持 Chrome 原生快捷键触发
- 可自定义标签组名称和颜色
- 可选择浏览器错误样式、本地/远程图片或用户设置的网页地址作为遮挡页面
- 可上传本地图片或填写远程图片 URL 作为遮挡图片
- 可填写 http/https 网页地址作为触发后的打开目标
- 所有配置保存在浏览器本地
- 扩展界面支持简体中文、英文、日文、韩文、德文和法文，并可在设置页切换

PanicTab 不会关闭你的标签页，也不会把标签页内容上传到任何服务器。扩展只使用必要权限来读取当前窗口标签页、创建/更新标签组、监听用户主动触发操作，并保存本地设置。若用户主动选择网页地址模式，浏览器会直接访问用户保存的网址。
```

## 简短说明

```text
一键整理标签页并打开预设遮挡页面。
```

## 权限用途说明

`tabs`

```text
用于读取当前窗口中打开的标签页，并在用户主动触发 PanicTab 后将这些标签页归入同一个标签组。PanicTab 不会上传、出售或共享标签页信息。
```

`tabGroups`

```text
用于创建和更新 Chrome 标签组，包括设置标签组名称、颜色以及折叠状态。
```

`storage`

```text
用于在浏览器本地保存扩展设置，例如触发方式、标签组名称、标签组颜色、遮挡页面类型、自定义图片配置和用户设置的网页地址。
```

`host_permissions: http://*/*, https://*/*`

```text
用于在普通网页中注入内容脚本，以监听用户主动设置的鼠标三连击和网页内键盘触发。内容脚本不读取网页正文，也不会收集或上传网页内容。
```

## 单一用途声明

```text
PanicTab 的单一用途是帮助用户在主动触发时快速整理当前窗口的标签页，并打开一个用户配置的遮挡页面。
```

## 隐私实践填写建议

是否收集用户数据：

```text
否。PanicTab 不会收集、出售、共享或远程传输用户数据。扩展设置仅保存在用户浏览器本地。
```

是否使用远程服务器：

```text
否。PanicTab 的核心功能在本地运行。仅当用户主动填写远程图片 URL 或选择网页地址模式时，浏览器会加载用户设置的外部地址。
```

是否用于广告或个性化追踪：

```text
否。
```

是否有付费功能或应用内购买：

```text
否。
```

## 图片素材清单

必须准备：

```text
扩展包内 128x128 PNG 图标：已提供 assets/panictab-shield-icon-128.png。
至少 1 张商店截图：建议截取设置页和触发后的标签组效果。
小型宣传图：建议额外制作 440x280 PNG。
```

建议准备：

```text
截图 1：PanicTab 设置页，展示触发方式、分组名称、颜色和遮挡页面设置。
截图 2：触发后的 Chrome 标签组折叠效果。
截图 3：遮挡页面图片模式、网页地址模式或本地遮挡页面效果。
宣传图 440x280：使用 assets/store-promo/scenarios/final/panictab-scenario-office-440x280.png。
大型宣传图 1400x560：使用 assets/store-promo/scenarios/final/panictab-scenario-meeting-1400x560.png。
补充展示图 1280x800：可使用 assets/store-promo/scenarios/final/panictab-scenario-public-1280x800.png 或 panictab-scenario-collage-1280x800.png。
```

截图尺寸：

```text
推荐 1280x800；也可以使用 640x400。截图应展示真实扩展体验。
```

图标说明：

```text
扩展包内已经提供 assets/panictab-shield-icon-128.png。Chrome 官方建议 128x128 PNG 图标中主体视觉约为 96x96，并保留透明边距；当前图标可直接用于测试，如要追求商店最佳观感，可后续再做透明边距优化版。
```

截图说明文案：

```text
设置触发方式、标签组名称、标签组颜色和遮挡页面。
```

```text
有人靠近屏幕时，一键收起标签页并打开预设遮挡页面。
```

```text
会议共享前，快速清理浏览器窗口。
```

```text
在公共空间使用电脑时，快速保护屏幕隐私。
```

## 上架前检查

```text
1. 在 chrome://extensions 中重新加载扩展并确认无错误。
2. 测试双击 Ctrl、工具栏按钮和 Chrome 原生快捷键；如启用鼠标三连击，也测试该触发方式。
3. 测试设置页中的标签组名称、颜色、图片配置和网页地址配置。
4. 确认截图展示真实功能，不夸大或误导。
5. 准备中文和英文隐私政策 URL。
6. 准备商店截图和宣传图。
7. 将扩展目录打包为 ZIP，排除 .git、临时文件和不需要的生成文件。
```

Windows PowerShell 打包示例：

```powershell
$version = "0.1.0"
$staging = Join-Path $env:TEMP "PanicTab-$version"
$out = Join-Path (Get-Location) "dist\PanicTab-$version.zip"
Remove-Item $staging -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path "$staging\assets", "$staging\src", "$staging\_locales" -Force | Out-Null
Copy-Item manifest.json, README.md -Destination $staging
Copy-Item _locales\* -Destination "$staging\_locales" -Recurse
Get-ChildItem src -Recurse -File | ForEach-Object {
  $target = Join-Path "$staging\src" $_.FullName.Substring((Resolve-Path src).Path.Length).TrimStart('\')
  New-Item -ItemType Directory -Path (Split-Path $target) -Force | Out-Null
  Copy-Item $_.FullName -Destination $target
}
Copy-Item assets\default-bluescreen.svg, assets\panictab-shield-icon-16.png, assets\panictab-shield-icon-32.png, assets\panictab-shield-icon-48.png, assets\panictab-shield-icon-128.png -Destination "$staging\assets"
New-Item -ItemType Directory -Path (Split-Path $out) -Force | Out-Null
Remove-Item $out -Force -ErrorAction SilentlyContinue
Compress-Archive -Path "$staging\*" -DestinationPath $out
```

## 合规注意

Chrome Web Store 要求商店信息准确、完整，并需要图标和截图。隐私标签页需要说明扩展用途以及权限理由。若扩展处理用户数据，需要提供准确且可访问的隐私政策。

另外，Chrome Web Store 政策不鼓励误导用户或模仿系统/浏览器警告。PanicTab 当前包含本地错误风格遮挡页；公开上架时建议在产品说明中强调“用户主动触发的本地遮挡页面”，避免声称它是真实浏览器崩溃页。

官方参考：

- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/webstore/best-listing
- https://developer.chrome.com/docs/webstore/images
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- https://developer.chrome.com/docs/webstore/program-policies/listing-requirements
- https://developer.chrome.com/docs/webstore/program-policies/policies
