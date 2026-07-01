# PanicTab Chrome Web Store Listing Materials

The content in this document can be copied into the Chrome Web Store Developer Dashboard. For public listing, position PanicTab as a tab organization and quick cover tool. Avoid over-emphasizing "fake browser crashes" to reduce the risk of a misleading experience review.

## Basic Information

Extension name:

PanicTab

Short description:

Organize tabs and open a preset cover page for screen sharing, public spaces, and quick privacy moments.

Recommended category:

Productivity

Recommended listing languages:

English and Simplified Chinese for the first listing pass. The extension interface supports Simplified Chinese, English, Japanese, Korean, German, and French.

Official website:

Fill in your project homepage, GitHub repository, or product page URL.

Support contact email:

Fill in your developer contact email.

Privacy policy URL:

Fill in the URL of your published privacy policy. You can publish the content from `docs/privacy-policy.en.md` and `docs/privacy-policy.zh-CN.md`.

## Detailed Description

PanicTab is a lightweight tab organization and quick cover tool for moments when you need to protect what is visible on your screen, such as before screen sharing, in open offices, or while working in public spaces.

When someone approaches your screen, a meeting is about to start, or you want to keep browser content less visible in a public space, trigger PanicTab with double Ctrl, the extension toolbar button, or Chrome's native shortcut. PanicTab groups collectable tabs in the current window into a collapsed Chrome tab group and opens the cover page chosen by the user. Triple left-click triggering can be enabled manually in the options page and is off by default.

Common scenarios:

- Someone approaches your screen: quickly collapse tabs and switch to a preset cover page
- Before screen sharing or a live demo: clean up a cluttered browser window
- In cafes, libraries, and open offices: reduce the chance that nearby people see private browser content
- While viewing personal pages, dashboards, email, or documents: switch to a page that is safer to show

Key features:

- Quickly organize tabs in the current window
- Move tabs into one collapsed Chrome tab group
- Double Ctrl trigger on ordinary webpages by default
- Optional triple left-click trigger
- Toolbar button trigger
- Chrome native shortcut trigger
- Customizable tab group name and color
- Choose a browser error-style page, local/remote image, or user-defined webpage URL as the cover page
- Upload a local image or enter a remote image URL as the cover image
- Enter an http/https webpage URL as the page opened after triggering
- All configuration is stored locally in the browser
- Extension interface supports Simplified Chinese, English, Japanese, Korean, German, and French, with an in-options language switcher

PanicTab does not close your tabs and does not upload tab contents to any server. It uses only the permissions needed to read tabs in the current window, create/update tab groups, listen for user-triggered actions, and save local settings. If the user selects webpage URL mode, the browser directly visits the saved URL.

Recommended promotional assets:

- Small promotional tile: `assets/store-promo/scenarios/final/panictab-scenario-office-440x280.png`
- Large promotional tile: `assets/store-promo/scenarios/final/panictab-scenario-meeting-1400x560.png`
- Feature image: `assets/store-promo/scenarios/final/panictab-scenario-public-1280x800.png`
- Scenario overview: `assets/store-promo/scenarios/final/panictab-scenario-collage-1280x800.png`

## Permission Justifications

`tabs`

Used to read tabs open in the current window and group them after the user actively triggers PanicTab. PanicTab does not upload, sell, or share tab information.

`tabGroups`

Used to create and update Chrome tab groups, including group name, color, and collapsed state.

`storage`

Used to save extension settings locally in the browser, such as trigger preferences, tab group name, tab group color, cover page type, custom image configuration, and user-defined webpage URL.

`http://*/*` and `https://*/*`

Used to inject a content script into ordinary webpages so PanicTab can listen for user-configured triple-click and in-page keyboard triggers. The content script does not read webpage text and does not collect or upload webpage content.

## Single Purpose Statement

PanicTab's single purpose is to help users quickly organize tabs in the current window and open a user-configured cover page when the user actively triggers it.

## Privacy Practice Answers

Does the extension collect user data?

No. PanicTab does not collect, sell, share, or remotely transmit user data. Extension settings are stored only in the user's local browser.

Does the extension use remote servers?

No. PanicTab's core functionality runs locally. Only when the user enters a remote image URL or chooses webpage URL mode will the browser load an external address configured by the user.

Does the extension use ads or personalized tracking?

No.

Does the extension include paid features or in-app purchases?

No.

## Pre-Publication Checklist

1. Reload the extension in `chrome://extensions` and confirm there are no errors.
2. Test double Ctrl, toolbar button, and Chrome native shortcut. If triple left-click is enabled, test that trigger too.
3. Test tab group name, color, image configuration, webpage URL configuration, and language display.
4. Confirm screenshots show the real extension experience and are not exaggerated or misleading.
5. Prepare privacy policy URLs in English and Simplified Chinese.
6. Prepare store screenshots and promotional images.
7. Package the extension directory as a ZIP and exclude `.git`, temporary files, and unnecessary generated files.

Windows PowerShell packaging example:

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

## Compliance Notes

Chrome Web Store listing information should be accurate and complete, and the listing needs icons and screenshots. The privacy tab should explain the extension purpose and permission reasons. If the extension handles user data, provide an accurate and accessible privacy policy.

Chrome Web Store policies discourage misleading users or imitating system/browser warnings. PanicTab includes a local error-style cover page; for public listing, describe it as a user-triggered local cover page and avoid claiming it is a real browser crash page.
