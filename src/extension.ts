import * as vscode from 'vscode';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      { scheme: 'file' },   // all files on disk
      {
        provideDocumentLinks(doc: vscode.TextDocument): vscode.DocumentLink[] {
          const links: vscode.DocumentLink[] = [];

          // matches: "/absolute/path/to/file.ext"  (quoted or bare)
          const re = /(?:["'])(\/[^"'\s]+)(?:["'])|(\/[\w.\-/]+)/g;

          for (let i = 0; i < doc.lineCount; i++) {
            const line = doc.lineAt(i);
            let m: RegExpExecArray | null;

            re.lastIndex = 0;
            while ((m = re.exec(line.text)) !== null) {
              const path = m[1] ?? m[2];

              // only link if the file actually exists
              try { fs.accessSync(path); } catch { continue; }

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