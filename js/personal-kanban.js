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
    const textArea = document.createElement('textarea');
    textArea.classList.add('block-edit');
    textArea.addEventListener('keydown', listenForEnter);
    newBlock.appendChild(textArea);
    activeWorkspace.appendChild(newBlock);
    textArea.focus();
    console.log(document.activeElement);
};
const listenForEnter = (event) => {
    if(event.key == "Enter") {
        event.target.parentElement.innerText = event.target.value;
        event.target.remove();
        event.preventDefault();
    }
};
const onKeyDownEvent = document.body.addEventListener('keypress', createBlockAndSetFocusIfNeeded);