# file-path-links
# file-path-links

Ctrl+Click absolute file paths in any file — just like the terminal.

## Usage

Hold **Ctrl** and hover over any absolute path string. If the file exists on disk,
it underlines. Click to open it in a new tab.

```tcl
# works in .tcl, .py, .txt, anything
read_bd "/home/user/project/build/bd/design.bd"
```

## Install

```bash
vsce package
code --install-extension file-path-links-0.0.1.vsix
```

## Notes

- Only absolute paths (starting with `/`) are detected.
- Paths that don't exist on disk are silently skipped — no false positives.
- No configuration needed.