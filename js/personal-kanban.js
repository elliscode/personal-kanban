let activeWorkspace = document.getElementsByClassName('desktop')[0];
const createBlockAndSetFocusIfNeeded = (event) => {
    let activeElement = document.activeElement;
    while(activeElement) {
        if(activeElement.classList.contains('block')) {
            return;
        }
        activeElement = activeElement.parentElement;
    }
    const newBlock = document.createElement('div');
    newBlock.tabIndex = 0;
    newBlock.classList.add('block');
    newBlock.addEventListener('click', setFocus);
    newBlock.addEventListener('focus', decideWhatTextToShow);
    newBlock.addEventListener('blur', decideWhatTextToShow);
    activeWorkspace.appendChild(newBlock);
    editBlock(newBlock);
    decideWhatTextToShow();
};
const editBlock = (block) => {
    const blockText = block.innerText;
    block.innerText = '';
    const textArea = document.createElement('textarea');
    textArea.classList.add('block-edit');
    textArea.addEventListener('keydown', listenForEnter);
    textArea.addEventListener('blur', onBlurCallback);
    textArea.value = blockText;
    block.appendChild(textArea);
    textArea.focus();
};
const setFocus = (event) => {
    let item = event.target;
    if (item.classList.contains('block')) {
        item.focus();
    }
};
const listenForEnter = (event) => {
    if(event.key == "Enter" && !event.shiftKey) {
        setValueOfParent(event);
        decideWhatTextToShow();
    }
};
const onBlurCallback = (event) => {
    setValueOfParent(event);
};
const setValueOfParent = (event) => {
    let block = event.target;
    while(block) {
        if(block.classList.contains('block')) {
            break;
        }
        block = block.parentElement;
    }
    block.innerText = event.target.value;
    block.addEventListener('keypress', keyPressedOnBlock);
    event.target.remove();
    event.preventDefault();
};
const keyPressedOnBlock = (event) => {
    if (event.key.toLowerCase() == 'd') {
        event.target.remove();
    } else if (event.key.toLowerCase() == 'e') {
        event.target.removeEventListener('keypress', keyPressedOnBlock);
        editBlock(event.target);
    }
    event.stopPropagation();
    event.preventDefault();
};
const decideWhatTextToShow = (event) => {
    const noBlocks = document.getElementById('no-blocks');
    noBlocks.style.display = 'none';
    const midBlocks = document.getElementById('mid-block');
    midBlocks.style.display = 'none';
    const blockControls = document.getElementById('block-controls');
    blockControls.style.display = 'none';
    const textAreas = Array.from(document.getElementsByTagName('textarea'));
    const isBlockActive = document.activeElement.classList.contains('block');
    if (textAreas.length > 0) {
        midBlocks.style.display = 'block';
    } else if (isBlockActive) {
        blockControls.style.display = 'block';
    } else {
        noBlocks.style.display = 'block';
    }
};
const onKeyDownEvent = document.body.addEventListener('keypress', createBlockAndSetFocusIfNeeded);
decideWhatTextToShow();