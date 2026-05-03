import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentLinkProvider(
      { scheme: 'file' },
      {
        provideDocumentLinks(doc: vscode.TextDocument): vscode.DocumentLink[] {
          const links: vscode.DocumentLink[] = [];

          const workspaceRoot = vscode.workspace.getWorkspaceFolder(doc.uri)?.uri.fsPath
            ?? vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

          // group 1: quoted absolute   "/abs/path"
          // group 2: bare absolute     /abs/path
          // group 3: quoted relative   "rel/path" or "./rel/path"
          // group 4: bare relative     ./rel/path  (must start with ./ to avoid false positives)
          const re = /["'](\/[^/"'\s][^"'\s]*)["']|(\/[\w][\w.\-/]*)|["'](\.{0,2}\/[^"'\s]+)["']|(\.{1,2}\/[\w][\w.\-/]*)/g;

          for (let i = 0; i < doc.lineCount; i++) {
            const line = doc.lineAt(i);
            let m: RegExpExecArray | null;
            re.lastIndex = 0;

            while ((m = re.exec(line.text)) !== null) {
              const raw = m[1] ?? m[2] ?? m[3] ?? m[4];
              const isQuoted = m[1] !== undefined || m[3] !== undefined;
              const isRelative = m[3] !== undefined || m[4] !== undefined;

              // can't resolve relative path without a workspace root
              if (isRelative && !workspaceRoot) { continue; }

              const resolved = isRelative
                ? path.resolve(workspaceRoot!, raw)
                : raw;

              try {
                if (!fs.statSync(resolved).isFile()) { continue; }
              } catch { continue; }

              const startChar = m.index + (isQuoted ? 1 : 0);
              const start = new vscode.Position(i, startChar);
              const end   = new vscode.Position(i, startChar + raw.length);
              links.push(new vscode.DocumentLink(
                new vscode.Range(start, end),
                vscode.Uri.file(resolved)
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