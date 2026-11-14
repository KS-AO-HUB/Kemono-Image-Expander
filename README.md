<p align="center">
  <img src="extension/images/128.png" width="96" alt="">
</p>

<h1 align="center">Pawchive Image Expander</h1>

<p align="center">
  A small browser extension for Chrome and Firefox that shows full-resolution images on
  <a href="https://pawchive.pw">Pawchive</a> post pages, instead of blurry thumbnails you have to click one by one.
</p>

---

Formerly **Kemono Image Expander**. Kemono is mostly gone now, so the extension targets Pawchive.
It still runs on `kemono.cr` and `kemono.su` too, because those pages use the same layout.

<img width="1605" height="554" alt="A post with its images expanded to full size" src="https://github.com/user-attachments/assets/f0990ea8-045c-44bd-950c-a71f36b91a98" />

## What it does

- **Only expands images on posts you open**, for example
  `https://pawchive.pw/<service>/user/<creator-id>/post/<post-id>`.
- **Creator profiles, search and listing pages are left alone**, so
  `https://pawchive.pw/<service>/user/<creator-id>` won't start downloading every full-size image on the page.
- Each thumbnail is swapped for the original file it links to. If that file fails to load, the thumbnail comes back.
- No tracking, no network requests of its own, no extra permissions. It only runs on the sites listed in
  [`manifest.json`](extension/manifest.json).

## Install

First, get the files:

- **Easiest:** download the latest `pawchive-image-expander-vX.Y.Z.zip` from the
  [Releases](../../releases) page and unzip it, **or**
- click **Code → Download ZIP** on this page, unzip it, and use the `extension` folder inside.

Keep the folder somewhere permanent, like `Documents`. The browser loads it from there, so don't delete it afterwards.

### Chrome, Edge, Brave, Opera and other Chromium browsers

1. Open the menu (⋮) in the top-right corner.

   <img width="1908" height="967" alt="Chrome menu" src="https://github.com/user-attachments/assets/12182c40-4567-4e17-b62f-8c9ab6864efe" />

2. Go to **Extensions → Manage Extensions**, or type `chrome://extensions` in the address bar.

   <img width="1919" height="1015" alt="Manage extensions" src="https://github.com/user-attachments/assets/0d247610-8a52-4960-92e8-5c4043f07850" />

3. Turn on **Developer mode** (toggle in the top-right).

   <img width="1919" height="279" alt="Developer mode toggle" src="https://github.com/user-attachments/assets/64edf11e-0af1-4c54-8d39-11137f2385af" />

4. Click **Load unpacked**.

   <img width="570" height="270" alt="Load unpacked button" src="https://github.com/user-attachments/assets/192e15b2-8ccf-43c1-a529-8fec7b0b0b07" />

5. Select the unzipped folder that has `manifest.json` directly inside it.

   <img width="952" height="593" alt="Selecting the extension folder" src="https://github.com/user-attachments/assets/b2e10ad9-b5a5-4aae-bbd4-2e30fbd40121" />

6. Refresh any open Pawchive tabs and you're done.

> Chrome may show an *"Unrecognized manifest key 'browser_specific_settings'"* notice under **Errors**.
> That part of the manifest is for Firefox. It is harmless and you can ignore it.

### Firefox

Firefox only keeps unsigned extensions until you restart the browser. Pick whichever option suits you.

#### Option A: Temporary install (any Firefox, removed on restart)

1. Type `about:debugging#/runtime/this-firefox` in the address bar.
2. Click **Load Temporary Add-on…**.
3. Open the unzipped folder and select `manifest.json`.
4. Refresh any open Pawchive tabs.

#### Option B: Permanent install (Firefox Developer Edition, Nightly or ESR)

Regular Firefox only installs signed add-ons. Developer Edition, Nightly and ESR let you switch that check off:

1. Type `about:config` in the address bar and accept the warning.
2. Search for `xpinstall.signatures.required` and set it to **false**.
3. Zip the *contents* of the extension folder, so that `manifest.json` sits at the top of the zip, not inside a subfolder.
   The release zip is already built this way.
4. Type `about:addons`, click the ⚙️ gear, choose **Install Add-on From File…**, and pick the zip.

#### Firefox permissions

If the extension doesn't do anything on Firefox, open `about:addons`, click **Pawchive Image Expander → Permissions**, and make
sure access to `pawchive.pw` is allowed. You can also click the puzzle-piece icon on a Pawchive tab and allow it there.

## Updating

Replace the files in your extension folder with the new version. Then:

- **Chrome:** click the ↻ reload icon on the extension card at `chrome://extensions`.
- **Firefox:** click **Reload** at `about:debugging`, or reinstall the zip.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Nothing happens on a post | Refresh the page. Check the extension is enabled and, on Firefox, that it has permission for the site. |
| Images expand on a profile page | They shouldn't. Please open an issue with the URL. |
| Pawchive moved to a new domain | Add the new domain to `matches` in `extension/manifest.json`, reload the extension, and open an issue or PR. |

## Project layout

```
extension/
  manifest.json   Manifest V3, shared by Chrome and Firefox
  content.js      The whole extension
  images/         Icons
.github/workflows/release.yml   Builds the release zip when a version tag is pushed
```

### Making a release

1. Bump `version` in `extension/manifest.json`.
2. Commit, then tag and push:

   ```bash
   git tag v2.0.0
   git push origin v2.0.0
   ```

GitHub Actions zips the `extension` folder and attaches it to a new release.

## Disclaimer

This is an unofficial extension. It isn't affiliated with Pawchive, Kemono or any of the creator platforms they archive.
