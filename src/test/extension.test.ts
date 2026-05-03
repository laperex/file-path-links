// src/test/extension.test.ts
import * as assert from 'assert';
import * as vscode from 'vscode';
import * as fs   from 'fs';
import * as os   from 'os';
import * as path from 'path';
import { FilePathLinkProvider } from '../extension';

suite('FilePathLinkProvider', () => {
  let tmp: string;
  const provider = new FilePathLinkProvider();

  setup(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fplinks-'));
  });

  teardown(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  // --- helpers ---

  function touch(name: string): string {
    const p = path.join(tmp, name);
    fs.writeFileSync(p, '');
    return p;
  }

  function mkdir(name: string): string {
    const p = path.join(tmp, name);
    fs.mkdirSync(p);
    return p;
  }

  async function getLinks(content: string): Promise<vscode.DocumentLink[]> {
    const doc = await vscode.workspace.openTextDocument({ content });
    return provider.provideDocumentLinks(doc);
  }

  function targets(ls: vscode.DocumentLink[]): string[] {
    return ls.map(l => l.target!.fsPath);
  }

  // --- absolute paths ---

  test('quoted absolute path', async () => {
    const p = touch('synth.tcl');
    assert.deepStrictEqual(targets(await getLinks(`source "${p}"`)), [p]);
  });

  test('bare absolute path', async () => {
    const p = touch('synth.tcl');
    assert.deepStrictEqual(targets(await getLinks(`source ${p}`)), [p]);
  });

  test('multiple paths on one line', async () => {
    const a = touch('a.tcl');
    const b = touch('b.tcl');
    const ls = await getLinks(`source "${a}" "${b}"`);
    assert.deepStrictEqual(targets(ls), [a, b]);
  });

  test('multiple paths across lines', async () => {
    const a = touch('a.tcl');
    const b = touch('b.tcl');
    const ls = await getLinks(`"${a}"\n"${b}"`);
    assert.deepStrictEqual(targets(ls), [a, b]);
  });

  // --- negatives ---

  test('nonexistent path → no link', async () => {
    const ls = await getLinks(`"/absolutely/does/not/exist/fake.tcl"`);
    assert.strictEqual(ls.length, 0);
  });

  test('directory → no link', async () => {
    const d = mkdir('subdir');
    const ls = await getLinks(`"${d}"`);
    assert.strictEqual(ls.length, 0);
  });

  test('double-slash // → no link', async () => {
    const ls = await getLinks(`// a comment`);
    assert.strictEqual(ls.length, 0);
  });

  test('bare relative without ./ → no link', async () => {
    touch('build.sh');
    // "scripts/build.sh" — no leading ./ or /  — should not match
    const ls = await getLinks(`run "scripts/build.sh"`);
    assert.strictEqual(ls.length, 0);
  });

  // --- relative paths (require workspace) ---

  test('quoted ./ relative path', async () => {
    const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!root) { return; }  // skip if no workspace open in test runner

    const p = path.join(root, 'test-rel.tcl');
    fs.writeFileSync(p, '');
    try {
      const ls = await getLinks(`source "./test-rel.tcl"`);
      assert.ok(ls.some(l => l.target?.fsPath === p), 'expected a link to test-rel.tcl');
    } finally {
      fs.unlinkSync(p);
    }
  });

  test('quoted ../ relative path', async () => {
    const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!root) { return; }

    const p = path.join(path.dirname(root), 'outside.tcl');
    fs.writeFileSync(p, '');
    try {
      const ls = await getLinks(`source "../outside.tcl"`);
      assert.ok(ls.some(l => l.target?.fsPath === p));
    } finally {
      fs.unlinkSync(p);
    }
  });
});