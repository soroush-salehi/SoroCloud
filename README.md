# SoroCloud

A browser-local file workspace prototype using IndexedDB.

## Current features
- Add multiple files from the device.
- Store file blobs in browser IndexedDB.
- Search files by name.
- Preview images, download, and remove stored files.
- Show file type and storage size.

## Stack
HTML, CSS, Vanilla JavaScript, IndexedDB.

## Run
Open `index.html` through a local static web server. Browser storage is scoped to the current site origin.

## Important limitations
Files are stored only in the current browser profile. They are not uploaded to a server or synchronized between devices. Browser storage quotas and eviction behavior vary.

## Roadmap
PHP upload API, authenticated accounts, quotas, folder metadata, sharing permissions, and server-side storage.