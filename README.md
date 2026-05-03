# File Path Links

[![Version](https://img.shields.io/visual-studio-marketplace/v/laperex.file-path-links?color=blue)](https://marketplace.visualstudio.com/items?itemName=laperex.file-path-links)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/laperex.file-path-links)](https://marketplace.visualstudio.com/items?itemName=laperex.file-path-links)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/laperex.file-path-links)](https://marketplace.visualstudio.com/items?itemName=laperex.file-path-links)
[![License](https://img.shields.io/github/license/laperex/file-path-links)](LICENSE)

Ctrl+click file paths in any file to open them.

## Behavior

- Absolute paths: `/home/user/project/build/bd/design.bd`
- Relative paths (from workspace root): `./scripts/synth.tcl`, `../common/pkg.sv`
- Quoted or bare, any file type
- Paths that don't exist on disk are ignored

## Install

Search `File Path Links` in the Extensions panel, or:

```
ext install laperex.file-path-links
```

## License

MIT