# Emacs C-k

This is a VSCode Extension to implement C-k and C-y functionalities of Emacs or more specifically Xcode.

* `C-k` deletes a line like `kill-line` in Emacs.
* `C-k` copies the deleted text to the internal buffer.
* Repeating `C-k` appends deleted text to the internal buffer.
* `C-y` pasts from the internal buffer.
* No *kill-ring*.
* No integration between the internal buffer and the OS clipboard.
