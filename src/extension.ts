// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

var captionChars = ['*', '~', '=', '-', '^', '"', ',', "'"]

function addCaptionAboveCompute(position: vscode.Position, editor: vscode.TextEditor) {
	console.log(position)
	var currentLine = position.line
	if (currentLine < 1) {
		return null
	}
	var captionChar = "="

	var beforeLineLength = editor.document.lineAt(currentLine - 1).text.length
	var currentLineText = editor.document.lineAt(currentLine).text
	var currentLineLength = currentLineText.length
	if (currentLineText.length > 0) {
		console.log(currentLineText.length)
		var firstChar = currentLineText[0]
		if (captionChars.filter(x => x == firstChar).length > 0) {
			captionChar = firstChar
		}
	}

	var captionLineText = Array.apply(null, Array(beforeLineLength)).map(x => captionChar).join("")

	return {
		currentLine: currentLine,
		currentLineLength: currentLineLength,
		captionLineText: captionLineText
	}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('my-rst.captionFormat', () => {
		var editor = vscode.window.activeTextEditor
		if (!editor) {
			return
		}

		var operations = editor.selections.reverse()
			.map(x => addCaptionAboveCompute(x.active, editor!))
			.filter(x => x != null)

		editor.edit((x) => {
			for (var operation of operations) {
				var currentLine = operation!.currentLine
				x.delete(new vscode.Range(new vscode.Position(currentLine, 0), new vscode.Position(currentLine, operation!.currentLineLength)))
				x.insert(new vscode.Position(currentLine, 0), operation!.captionLineText)
			}
		})

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
