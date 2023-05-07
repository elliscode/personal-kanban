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
    newBlock.classList.add('block');
    newBlock.id = crypto.randomUUID();
    addTabIndices(newBlock);
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
    setEditBlockCallbacks(block);
    textArea.focus();
};
const setFocus = (event) => {
    let item = event.target;
    if (item.classList.contains('block')) {
        item.focus();
    }
};
const listenForEnter = (event) => {
    if(event.key.toLowerCase() == 'enter' && !event.shiftKey) {
        parent = setValueOfParent(event);
        decideWhatTextToShow();
        setFocus({target: parent});
        saveLocalStorage();
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
    event.target.remove();
    event.preventDefault();
    setNormalBlockCallbacks(block);
    return block;
};
const keyPressedOnBlock = (event) => {
    if (event.key.toLowerCase() == 'c') {
        changeColor(event);
    } else if (event.key.toLowerCase() == 'd') {
        showModal(event, 'delete-modal');
    } else if (event.key.toLowerCase() == 'e') {
        event.target.removeEventListener('keypress', keyPressedOnBlock);
        editBlock(event.target);
    } else if (event.key.toLowerCase() == 'enter') {
        event.target.blur();
    }
    event.stopPropagation();
    event.preventDefault();
};
const colors = [
    { border:'grey', background: '#ededed' },
    { border:'red', background: '#ffe7e7' },
    { border:'orange', background: '#fff6e7' },
    { border:'gold', background: '#fffdf2' },
    { border:'green', background: '#f0fff0' },
    { border:'blue', background: '#f4f4ff' },
    { border:'indigo', background: '#f8efff' },
    { border:'darkviolet', background: '#f7e5ff' },
];
const changeColor = (event) => {
    const currentColor = event.target.style.borderColor;
    const colorIndex = Math.max(0,colors.findIndex(c=>c.border==currentColor));
    const newIndex = index = (colorIndex + 1) % colors.length;
    event.target.style.borderColor = colors[newIndex].border;
    event.target.style.backgroundColor = colors[newIndex].background;
    saveLocalStorage();
};
let blockActiveWhenModalWasCalled = undefined;
const showModal = (event, type) => {
    blockActiveWhenModalWasCalled = event.target;
    const modals = document.getElementsByClassName('modal');
    for(const modal of modals) {
        modal.style.display = 'none';
    }
    const modal = document.getElementById(type);
    if(!modal) {
        return;
    }
    modal.style.display = 'flex';
    modal.getElementsByClassName('cancel')[0].focus();
    clearTabIndices();
    removeCallbacks();
};
const deleteSelectedItem = () => {
    blockActiveWhenModalWasCalled.remove();
    clearModal();
    saveLocalStorage();
}
const hideModals = () => {
    showModal({target: undefined}, 'none');
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
const clearTabIndices = (items) => {
    if(!items) {
        items = Array.from(document.getElementsByClassName('block'));
    } else if(!Array.isArray(items)) {
        items = [items];
    }
    for(const newBlock of items) {
        newBlock.removeAttribute('tabIndex');
    }
};
const addTabIndices = (items) => {
    if(!items) {
        items = Array.from(document.getElementsByClassName('block'));
    } else if(!Array.isArray(items)) {
        items = [items];
    }
    for(const newBlock of items) {
        newBlock.tabIndex = 0;
    }
};
const setEditBlockCallbacks = (items) => {
    if(!items) {
        items = Array.from(document.getElementsByClassName('block'));
    } else if(!Array.isArray(items)) {
        items = [items];
    }
    for(const newBlock of items) {
        newBlock.addEventListener('click', setFocus);
        newBlock.addEventListener('focus', decideWhatTextToShow);
        newBlock.addEventListener('blur', decideWhatTextToShow);
    }
};
const setNormalBlockCallbacks = (items) => {
    if(!items) {
        items = Array.from(document.getElementsByClassName('block'));
    } else if(!Array.isArray(items)) {
        items = [items];
    }
    for(const newBlock of items) {
        newBlock.addEventListener('keypress', keyPressedOnBlock);
    }
};
const removeCallbacks = (items) => {
    if(!items) {
        items = Array.from(document.getElementsByClassName('block'));
    } else if(!Array.isArray(items)) {
        items = [items];
    }
    for(const newBlock of items) {
        newBlock.removeEventListener('click', setFocus);
        newBlock.removeEventListener('focus', decideWhatTextToShow);
        newBlock.removeEventListener('blur', decideWhatTextToShow);
        newBlock.removeEventListener('keypress', keyPressedOnBlock);
    }
    document.body.removeEventListener('keypress', createBlockAndSetFocusIfNeeded);
};
const setBodyCallbacks = () => {
    document.body.addEventListener('keypress', createBlockAndSetFocusIfNeeded);
};
const clearModal = (event) => {
    hideModals();
    setEditBlockCallbacks();
    setNormalBlockCallbacks();
    addTabIndices();
    setBodyCallbacks();
};
const cancelModal = (event) => {
    const currentItem = blockActiveWhenModalWasCalled;
    clearModal();
    currentItem.focus();
};
const LOCAL_STORAGE_ID = 'personal-kanban-data';
const loadLocalStorage = () => {
    const kanbanString = localStorage.getItem(LOCAL_STORAGE_ID);
    let kanbanJson = {};
    try {
        kanbanJson = JSON.parse(kanbanString);
        if(!kanbanJson) {
            kanbanJson = {};
        }
    } catch (e) {
        
    }
    for(const key of Object.keys(kanbanJson)) {
        const item = kanbanJson[key];
        if(item.deleted) {
            continue;
        }
        const newBlock = document.createElement('div');
        newBlock.classList.add('block');
        newBlock.id = item.id;
        newBlock.innerText = item.text;
        const colorIndex = Math.max(0,colors.findIndex(c=>c.border==item.color));
        color = colors[colorIndex];
        newBlock.style.borderColor = color.border;
        newBlock.style.backgroundColor = color.background;
        activeWorkspace.appendChild(newBlock);
    }
    clearModal();
};
const saveLocalStorage = () => {
    const blocks = document.getElementsByClassName('block');
    const kanbanString = localStorage.getItem(LOCAL_STORAGE_ID);
    let kanbanJson = {};
    try {
        kanbanJson = JSON.parse(kanbanString);
        if(!kanbanJson) {
            kanbanJson = {};
        }
    } catch (e) {
        localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify({}));
    }
    for(const key of Object.keys(kanbanJson)) {
        kanbanJson[key].deleted = true;
    }
    for(const block of blocks) {
        kanbanJson[block.id] = {id: block.id, text: block.innerText, deleted: false, color: block.style.borderColor};
    }
    localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(kanbanJson));
};
loadLocalStorage();
decideWhatTextToShow();
setBodyCallbacks();