import * as assert from 'assert';
import { suite, test, beforeEach, afterEach } from 'mocha';

import * as vscode from 'vscode';
import { TextEditor } from 'vscode';

async function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

suite('Emacs C-k', () => {
	let editor: TextEditor = null as any

	beforeEach(async () => {
		const doc = await vscode.workspace.openTextDocument({ content: "Hello\nworld" })
		editor = await vscode.window.showTextDocument(doc)

		await sleep(100)
	})

	afterEach(async () => {
		await vscode.commands.executeCommand("workbench.action.closeActiveEditor")
	})

	test('kill', async () => {
		editor.selection = new vscode.Selection(0,2,0,2)
		await sleep(100)

		await vscode.commands.executeCommand("emacs-c-k.kill")
		await sleep(100)

		assert.strictEqual("He\nworld", editor.document.getText())
	})

	test('kill->yank', async () => {
		editor.selection = new vscode.Selection(0,2,0,2)
		await sleep(100)

		await vscode.commands.executeCommand("emacs-c-k.kill")
		await sleep(100)

		editor.selection = new vscode.Selection(1,0,1,0)
		await sleep(100)

		await vscode.commands.executeCommand("emacs-c-k.yank")
		await sleep(100)

		assert.strictEqual("He\nlloworld", editor.document.getText())
	})

	test('kill->kill', async () => {
		editor.selection = new vscode.Selection(0,2,0,2)
		await sleep(100)

		await vscode.commands.executeCommand("emacs-c-k.kill")
		await sleep(100)
		await vscode.commands.executeCommand("emacs-c-k.kill")
		await sleep(100)

		assert.strictEqual("Heworld", editor.document.getText())
	})

	test('kill->kill->yank', async () => {
		editor.selection = new vscode.Selection(0,2,0,2)
		await sleep(100)

		await vscode.commands.executeCommand("emacs-c-k.kill")
		await sleep(100)
		await vscode.commands.executeCommand("emacs-c-k.kill")
		await sleep(100)

		editor.selection = new vscode.Selection(0,0,0,0)

		await vscode.commands.executeCommand("emacs-c-k.yank")
		await sleep(100)

		assert.strictEqual("llo\nHeworld", editor.document.getText())
	})

	test('kill->move->kill->yank', async () => {
		editor.selection = new vscode.Selection(0,3,0,3)
		await sleep(100)

		await vscode.commands.executeCommand("emacs-c-k.kill")
		await sleep(100)

		editor.selection = new vscode.Selection(0,2,0,2)
		await sleep(100)

		await vscode.commands.executeCommand("emacs-c-k.kill")
		await sleep(100)

		editor.selection = new vscode.Selection(0,0,0,0)

		await vscode.commands.executeCommand("emacs-c-k.yank")
		await sleep(100)

		assert.strictEqual("lHe\nworld", editor.document.getText())
	})
});
