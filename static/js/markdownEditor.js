var MarkdownEditor = {
	get textarea() {
		return document.querySelector('#markdown-editor textarea') || undefined;
	},
	set textarea(val) {
		var wordCount;
		var wordCountEl;

		if(!document.querySelector('#markdown-editor textarea')) return;

		document.querySelector('#markdown-editor textarea').value = val;
		document.querySelector('#display-display').innerHTML = markdown.toHTML(val);

		blogPost.data.body = val;

		wordCount = document.querySelector('#display-display').textContent.trim().split(/\s/);
		wordCountEl = document.querySelector('#display-bar-wordcount');

		if(wordCount[0] === '' && wordCount.length === 1) {
			wordCountEl.innerHTML = '0 words';
		} else if(wordCount.length > 1) {
			wordCountEl.innerHTML = wordCount.length + ' words';
		} else {
			wordCountEl.innerHTML = '1 word';
		}
	}
};

MarkdownEditor.getPos = function(offset) {
	var textarea = this.textarea;
	var cursorPos = 0;

	if(document.selection) {
		cursorPos = Math.abs(document.selection.createRange().moveStart('character', -textarea.value.length));
	} else if(textarea.selectionStart) {
		cursorPos = textarea.selectionStart;
	}

	cursorPos += (offset || 0);

	return cursorPos;
}
MarkdownEditor.getLineBeginningPos = function(offset) {
	var cursorPos = this.getPos(offset);
	var firstBreak;
	var textarea = this.textarea;

	for(var i = cursorPos-1; i >= 0; i--) {
		if(textarea.value[i] === '\n') {
			firstBreak = i;
			break;
		} else if(i === 0) {
			firstBreak = 0;
		}
	}

	return firstBreak;
}
MarkdownEditor.getLine = function(offset) {
	var cursorPos = this.getPos(offset);
	var firstBreak = this.getLineBeginningPos(offset);
	
	return this.textarea.value.slice(firstBreak, cursorPos);
}
MarkdownEditor.getSelectionText = function() {
	var text = (this.textarea.value).substring(this.textarea.selectionStart,this.textarea.selectionEnd);
	return text;
};
MarkdownEditor.updateSelectionText = function(additionStart, additionEnd, optionalMessage) {
	var selectionStart = this.textarea.selectionStart;
	var selectionEnd = this.textarea.selectionEnd;

	var textStart = this.textarea.value.slice(0, selectionStart);
	var textEnd = this.textarea.value.slice(selectionEnd);
	var selectedText = this.getSelectionText();

	var updatedText = textStart + additionStart + (selectedText || optionalMessage || '')  + additionEnd + textEnd;

	this.textarea = updatedText;

	this.textarea.selectionStart = selectionStart + additionStart.length;
	this.textarea.selectionEnd = selectionEnd + additionStart.length;

	if(optionalMessage) {
		this.textarea.selectionEnd = selectionStart + optionalMessage.length + additionStart.length;
	}
};

MarkdownEditor.clickStyleButton = function(querySelector, additionStart, additionEnd, optionalMessage) {
	var self = this;
	document.body.addEventListener('click', function(ev) {
		if(ev.target === document.querySelector(querySelector)) {
			ev.preventDefault();
			self.updateSelectionText(additionStart, additionEnd, optionalMessage);
			self.textarea.focus();
		}
	})
}

on('#markdown-editor textarea', 'keyup', function(ev) {
	var markdownSource = ev.target.value;
	var line = MarkdownEditor.getLine(-1);

	if(ev.which === 13 && line.match(/([ \t]+)?[\*-][ \t]+[^\s]+/) !== null) {
		var textStart = MarkdownEditor.textarea.value.slice(0, MarkdownEditor.getPos());
		var textEnd = MarkdownEditor.textarea.value.slice(MarkdownEditor.getPos());

		MarkdownEditor.textarea = textStart + '* ' + textEnd;
	} else {
		MarkdownEditor.textarea = markdownSource;
	}
})
on('#markdown-editor textarea', 'keydown', function(ev) {
	var line = MarkdownEditor.getLine();
	var lineBeginning = MarkdownEditor.getLineBeginningPos();

	if(ev.which === 9 && line.match(/([ \t]+)?[\*-][ \t]+([^\s]+)?/) !== null) {
		var textStart = MarkdownEditor.textarea.value.slice(0, lineBeginning);
		var textEnd = MarkdownEditor.textarea.value.slice(lineBeginning + line.length);

		MarkdownEditor.textarea = textStart + '\n\t' + line.slice(1) + textEnd;

		ev.preventDefault();
		ev.stopImmediatePropagation();
		MarkdownEditor.textarea.focus();
		MarkdownEditor.textarea.selectStart = lineBeginning + line.length + 1;

	} else if(ev.which === 9) {
		MarkdownEditor.updateSelectionText('\t', '')
		ev.preventDefault();
		ev.stopImmediatePropagation();
		MarkdownEditor.textarea.focus();
	}
});
on('#me-list-ul', 'click', function(ev) {
	var lineBeginning = MarkdownEditor.getLineBeginningPos();
	var line = MarkdownEditor.getLine();
	var textStart = MarkdownEditor.textarea.value.slice(0, lineBeginning);
	var textEnd = MarkdownEditor.textarea.value.slice(lineBeginning + line.length);

	ev.preventDefault();
	ev.stopImmediatePropagation();

	if(line.match(/([ \t]+)?[\*-][ \t]+([^\s]+)?/) !== null) {
		return;
	}

	MarkdownEditor.textarea.focus();
	MarkdownEditor.textarea.selectStart = lineBeginning + line.length + 1;

	if(!lineBeginning) {
		MarkdownEditor.textarea = textStart + '* ' + (line || 'List item') + textEnd;
	} else {
		MarkdownEditor.textarea = textStart + '\n* ' + (line || 'List item') + textEnd;
	}

});

MarkdownEditor.clickStyleButton('#me-bold', '**', '**', 'bold text');
MarkdownEditor.clickStyleButton('#me-italic', '_', '_', 'italic text');
MarkdownEditor.clickStyleButton('#me-strikethrough', '~~', '~~', 'strikethrough text');
MarkdownEditor.clickStyleButton('#me-list-ul', '* ', '', 'list item');

Tooltip.onClick(
	'#me-link',
	'<input placeholder="URL address">',
	{	
		text: 'Add link',
		eventListener: function(ev) {
			var input = ev.target.parentElement.parentElement.querySelector('input');
			var url = input.value.trim();

			if(url.length) MarkdownEditor.updateSelectionText('[', '](' + url + ')');

			ev.removeTooltip();
		}
	}
);

on('#post-title','keyup', function(ev) {
	blogPost.data.title = ev.target.value.trim();
	document.querySelector('div[data-_id="' + blogPost.data._id + '"]').innerHTML = ev.target.value;
})