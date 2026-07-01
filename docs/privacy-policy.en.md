# PanicTab Privacy Policy

Effective date: 2026-07-01

PanicTab is a Chrome extension that helps users organize tabs in the current window and open a customizable cover page when the user actively triggers it.

## Data We Collect

PanicTab does not collect, sell, share, or remotely transmit user data.

The extension stores the following settings locally in the browser:

- Whether triple left-click trigger is enabled
- Whether in-page keyboard trigger is enabled
- In-page keyboard trigger type
- Tab group name
- Tab group color
- Cover page type
- Interface language preference
- Remote image URL entered by the user
- Cover webpage URL entered by the user
- Local image data uploaded by the user

These settings are stored only in `chrome.storage.local` on the user's local browser.

## Permission Usage

PanicTab uses the `tabs` permission to read tabs in the current window so it can group them when the user actively triggers PanicTab.

PanicTab uses the `tabGroups` permission to create and update Chrome tab groups, including the group name, color, and collapsed state.

PanicTab uses the `storage` permission to save extension settings locally in the browser.

PanicTab uses `http://*/*` and `https://*/*` host permissions to run a content script on ordinary webpages. The content script listens for user-configured triple-click and in-page keyboard triggers. It does not read webpage text, analyze page content, or upload page data.

## Data Sharing

PanicTab does not transmit user data to the developer or any third party.

If the user enters a remote image URL, the browser requests that image from the server that hosts the URL. If the user enters a cover webpage URL and selects that mode, the browser directly visits that webpage. These requests are not handled by a PanicTab server because PanicTab does not provide any remote server.

## Advertising and Tracking

PanicTab does not include ads, personalized advertising, or cross-site tracking.

## Limited Use Statement

PanicTab's use of information complies with the Chrome Web Store User Data Policy, including the Limited Use requirements. PanicTab uses permissions and local data only to provide or improve its single purpose: organizing tabs in the current window and opening the user-configured cover page when the user actively triggers it.

## Contact

For privacy-related questions, contact:

jxxiaobian@gmail.com
