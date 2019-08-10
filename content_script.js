let mappings;
chrome.storage.local.get({ mappings: [] }, data => {
  console.log(data);
  mappings = new Map(data.mappings);
});

const REGEX = /:([^:\s]+):/g;

window.onload = function() {
  document.body.addEventListener('input', ie => {
    console.log(ie);
    console.log(ie.getTargetRanges());
    console.log(ie.target.selectionStart, ie.target.selectionEnd);
    console.log(ie.target.innerText);
    console.log(ie.target.value);
1
    const { target } = ie;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const match = Array.from(target.value.matchAll(REGEX)).find(m => mappings.get(m[1]));
      if (match) {
        const [full, word] = match;
        target.setRangeText(mappings.get(word), match.index, match.index + full.length, 'end');
      }
    }
    else if (target.isContentEditable) {
      const selection = window.getSelection();
      if (selection.type === 'Caret' && selection.anchorNode.nodeName === '#text') {
        const match = Array.from(target.innerText.matchAll(REGEX)).find(m => mappings.get(m[1]));
        if (match) {
          const range = document.createRange();
          range.setStart(selection.anchorNode, match.index);
          range.setEnd(selection.focusNode, match.index + match[0].length);
          selection.removeAllRanges();
          selection.addRange(range);

          // messenger.com handles spaces weirdly
          for (const chunk of mappings.get(match[1]).split(' ')) {
            document.execCommand('insertText', false, chunk);
            document.execCommand('insertText', false, ' ');
          }
        }
      }
    }
    else {
      console.error('target not input, textarea, or contenteditable', target);
    }
  });
};
