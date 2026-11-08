# SoroCloud

> A local file workspace prototype.

Preview and organize files selected by the user in the current browser session. This prototype does not upload to a server or provide cloud storage; add authenticated backend storage before deploying as a multi-user service.

## Features

- Select multiple local files
- Search selected file names
- View file metadata
- Remove items from the current session

## Tech stack

HTML, CSS and vanilla JavaScript

## Run locally

Open `index.html` in a modern browser and select files.

## Scope and limitations

Files are read only for metadata and previews in this browser session. Nothing is uploaded.

## Project structure

```
SoroCloud/
├── index.html   # self-contained interface and application logic
└── README.md    # overview, setup and scope
```

## Development principles

- Keep the interface accessible, responsive and dependency-light.
- Prefer clear, readable code over unnecessary abstractions.
- Never commit credentials, private data or generated user files.
- Document limitations honestly and add tests as the project grows.

## License

No license has been selected yet. Until a license is added, all rights are reserved by the copyright holder.
