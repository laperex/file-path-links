# File Path Links

Ctrl+click absolute file paths anywhere — just like your terminal does.

## How it works

Hover over any absolute path in any file while holding **Ctrl**. If the path exists on disk it underlines and becomes clickable, opening it in a new editor tab. Paths that don't exist are silently ignored — no noise.

```tcl
# works in .tcl, .py, .conf, .txt — any file type
source "/home/user/project/scripts/synth.tcl"
read_bd "/home/user/project/build/bd/design.bd"
```

```python
# works in comments, strings, wherever
log_path = "/var/log/myapp/error.log"
```

## Install

**From the Marketplace**

Search `File Path Links` in the VS Code Extensions panel, or:

```bash
code --install-extension laperex.file-path-links
```

**From a VSIX**

```bash
code --install-extension file-path-links-0.0.1.vsix
```

## Notes

- Only absolute paths (starting with `/`) are matched — no relative path false positives.
- Directories are not linked, only regular files.
- No configuration needed.

## License

MIT