import * as vscode from 'vscode';

function insert(text: string) {
	if (text.length === 0) return

    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const edit = new vscode.WorkspaceEdit();
        edit.insert(editor.document.uri, editor.selection.start, text);
        return vscode.workspace.applyEdit(edit)
    }
}

class Clipboard {
	private clearNext: boolean
	private texts: string[]

	constructor() {
		this.clearNext = false
		this.texts = []
	}

	append(text: string) {
		if (this.clearNext) {
			this.texts = [text]
		} else {
			this.texts.push(text)
		}

		this.clearNext = false
	}

	get text(): string {
		return this.texts.join("")
	}

	setClearNext() {
		this.clearNext = true
	}
}

export function activate(context: vscode.ExtensionContext) {
	const clipboard = new Clipboard()

	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(_ => {
			clipboard.setClearNext()
		})
	)

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(_ => {
			clipboard.setClearNext()
		})
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('emacs-c-k.yank', _ => {
			insert(clipboard.text)
		})
	)

	context.subscriptions.push(
		vscode.commands.registerCommand('emacs-c-k.kill', _ => {
			const editor = vscode.window.activeTextEditor
			if (editor) {
				const selection = editor.selection
				const line = editor.document.lineAt(selection.start.line)
				const range = new vscode.Range(selection.start, line.range.end)
				const text = editor.document.getText(range)
				if (text.length == 0) {
					clipboard.append("\n")
				} else {
					clipboard.append(text)
				}
				vscode.commands.executeCommand("deleteAllRight")
			}
		})
	)
}

export function deactivate() {}
