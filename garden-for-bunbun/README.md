# A Garden for Bunbun

A small, handmade-feeling garden and scrapbook for Bunbun. It is a static website: no account, database, server, or paid service is needed.

## Open it in VS Code

1. Download and unzip `A-Garden-for-Bunbun.zip`.
2. Open the unzipped `garden-for-bunbun` folder in VS Code.
3. If you do not already have it, install the **Live Server** extension.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Your browser should open the garden. Keep the folder together; the archive and photos load from files beside `index.html`.

You can also run a local server from PowerShell in the project folder:

```powershell
py -m http.server 8000
```

Then visit `http://localhost:8000`.

## What's inside

- A soft welcome page and illustrated garden.
- Click-to-bloom tulips, tiny sparkle effects, and progress saved in the browser.
- A scrapbook wall using the photos supplied for this project. Phone controls and screenshot borders have been cropped away where possible; the photos themselves are not filtered.
- **Our little archive**, containing the six entries from the supplied letters document. The wording is kept as provided; entries open like pages from a journal.
- A cozy bedroom corner with an interactive note and a little bunny.
- A record-player nook with Spotify search links for the requested artists and songs.
- Little sound effects that stay off until the visitor turns them on.

## Editing the archive

Open `archive-data.js`. Each entry has a `title`, `note`, and `body`. You can add another entry by copying one object and changing its text. Keep the file valid JavaScript: the contents are inside `window.BUNBUN_LETTERS = [...]`.

The archive entries are displayed in the order they appear in that file. The site's labels avoid day counters and numbered progress markers.

## Personalizing photos

Replace the images inside `assets/images/` with your preferred files, keeping the same filenames, or update the image paths in `index.html`. Use photos you have permission to share if you publish the site online.

## Publish it for free with GitHub Pages

1. Create a GitHub repository and upload the contents of this folder.
2. Open the repository's **Settings → Pages**.
3. Under the build/deployment section, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`, then save.
5. GitHub will provide the public website address after deployment.

Because this is a static site, the photos and letters are part of the website files. Anyone with the published link can view them. Keep the repository private until you are comfortable making the site public, and remember GitHub Pages requires a public repository on plans where private Pages hosting is unavailable.

## Notes

- Progress is saved in the browser's local storage on the device being used.
- Spotify links open Spotify; the website does not host copyrighted music.
- Google Fonts are optional. If the visitor is offline, the site falls back to system fonts.
- The website does not upload photos or letters anywhere by itself.
