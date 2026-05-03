import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      { scheme: 'file' },
      {
        provideDocumentLinks(doc: vscode.TextDocument): vscode.DocumentLink[] {
          const links: vscode.DocumentLink[] = [];

          // quoted:  "/path/to/file"  or  '/path/to/file'
          // bare:    /path/to/file   (must start with /word-char, no double-slash)
          const re = /(?:["'])(\/[^/"'\s][^"'\s]*)(?:["'])|(\/[\w][\w.\-/]*)/g;

          for (let i = 0; i < doc.lineCount; i++) {
            const line = doc.lineAt(i);
            let m: RegExpExecArray | null;
            re.lastIndex = 0;

            while ((m = re.exec(line.text)) !== null) {
              const path = m[1] ?? m[2];

              // only link if path resolves to a regular file (not a directory)
              try {
                if (!fs.statSync(path).isFile()) { continue; }
              } catch { continue; }

              const startChar = m.index + (m[1] ? 1 : 0); // skip opening quote
              const start = new vscode.Position(i, startChar);
              const end   = new vscode.Position(i, startChar + path.length);
              links.push(new vscode.DocumentLink(
                new vscode.Range(start, end),
                vscode.Uri.file(path)
              ));
            }
          }
          return links;
        }
      }
    )
  );
}

export function deactivate() {}