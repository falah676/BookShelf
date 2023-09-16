const EVENT_VAR = 'event';
const CUSTOM_EVENT = new Event(EVENT_VAR);
const booksData = [];
const STORAGE_KEY = 'THE BOOKS';
const SEARCH_EVENT = 'search_event'

const saveToStorage = () => {
    // check browser support
    if (typeof Storage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(booksData));
    } else {
        alert('Sorry! Update browser Anda untuk menikmati fitur ini..');
    }
}

const loadDataFromStorage = () => {
    if (typeof Storage !== "undefined") {
        const dataBooks = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (dataBooks !== null) {
            for (i of dataBooks) {
                booksData.push(i);
            }
        }
        document.dispatchEvent(CUSTOM_EVENT);
    } else {
        alert('Sorry! Update browser Anda untuk menikmati fitur ini..');
    }
}
const dataObject = (id, title, author, yearBook, isComplete) => {
    return {
        id,
        title,
        author,
        yearBook,
        isComplete
    }
}
const addBook = () => {
    const id = +new Date();
    const inputTitle = document.getElementById('inputBookTitle');
    const inputAuthor = document.getElementById('inputBookAuthor');
    const inputYear = document.getElementById('inputBookYear');
    const checkIsComplete = document.getElementById('inputBookIsComplete');

    const getTitle = inputTitle.value;
    const getAuthor = inputAuthor.value;
    const getYear = inputYear.value;
    const isComplete = checkIsComplete.checked;

    const bookObject = dataObject(id, getTitle, getAuthor, getYear, isComplete);
    booksData.push(bookObject);
    saveToStorage();
    document.dispatchEvent(CUSTOM_EVENT);
    inputTitle.value = '';
    inputAuthor.value = '';
    inputYear.value = '';
    checkIsComplete.checked = false;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inputBook');
    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        searchBook();
    })
    form.addEventListener('submit', (event) => {
        // buat dapetin id dari button saat edit
        const buttonSubmit = document.getElementsByClassName('bookSubmit');
        let idButton = '';
        for (let i = 0; i < buttonSubmit.length; i++) {
            idButton = buttonSubmit[i].id;
        }
        // btn edit end
        event.preventDefault();
        if (idButton === 'bookSubmit') {
            addBook();
        } else {
            const buttonEdit = document.getElementById(idButton);
            buttonEdit.id = 'bookSubmit';
            updateData(idButton);
        }
    })

    loadDataFromStorage();
})

const makeData = (data) => {
    const article = document.createElement('article');
    article.classList.add('book_item');
    article.setAttribute('id', data.id);

    const detailBooks = document.createElement('div');
    detailBooks.className = 'detail-book';

    const titleBooks = document.createElement('h3');
    const authorBooks = document.createElement('p');
    const yearBooks = document.createElement('p');
    const buttonGreen = document.createElement('button');
    const buttonRed = document.createElement('button');
    const buttonEdit = document.createElement('button');

    titleBooks.innerText = data.title;
    detailBooks.append(titleBooks);
    authorBooks.innerText = `Penulis: ${data.author}`;
    detailBooks.append(authorBooks);
    yearBooks.innerText = `Tahun Terbit: ${data.yearBook}`;
    detailBooks.append(yearBooks);
    article.append(detailBooks);

    const book = document.createElement('i');
    const edit = document.createElement('i');
    const trash = document.createElement('i');
    book.className = data.isComplete ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
    edit.className = 'fa-solid fa-pen-to-square';
    trash.className = 'fa-solid fa-trash';
    buttonGreen.append(book);
    buttonRed.append(trash);
    buttonEdit.append(edit);


    const actionButton = document.createElement('div');
    actionButton.className = 'action';
    buttonGreen.classList.add('book');
    buttonRed.classList.add('trash')
    actionButton.append(buttonGreen, buttonEdit, buttonRed);
    article.append(actionButton);

    buttonEdit.addEventListener('click', () => {
        editData(data.id)
    })
    buttonGreen.addEventListener('click', () => {
        changeStatus(data.isComplete ? false : true)(data.id);
    })
    buttonRed.addEventListener('click', () => {
        // remove item
        removeItem(data.id);
    })
    return article
}

const changeStatus = (readingStatus) => (id) => {
    const findItem = booksData.find(item => item.id === id);
    if (findItem != undefined) {
        findItem.isComplete = readingStatus;
    }
    document.dispatchEvent(CUSTOM_EVENT);
    saveToStorage();
}

const removeItem = (id) => {
    const findData = booksData.find(item => item.id === id);
    const confirmRemoveData = confirm(`Apakah Anda yakin ingin menghapus buku ${findData.title}?`);
    if (confirmRemoveData) {
        const index = booksData.findIndex((item) => item.id === id);
        booksData.splice(index, 1);
        document.dispatchEvent(CUSTOM_EVENT);
        saveToStorage();
        alert(`Buku ${findData.title} karya ${findData.author} telah dihapus dari rak`);
    }

}

document.addEventListener(EVENT_VAR, () => {
    const unread = document.getElementById('incompleteBookshelfList');
    const read = document.getElementById('completeBookshelfList');
    unread.innerHTML = '';
    read.innerHTML = '';

    for (const i of booksData) {
        const item = makeData(i);
        if (!i.isComplete) {
            unread.append(item);
        } else {
            read.append(item);
        }
    }
})



const searchBook = () => {
    const getSearchId = document.getElementById('searchBookTitle');
    const getSearchValue = getSearchId.value;
    const searchData = getBookByTitle(getSearchValue);
    document.dispatchEvent(new Event(SEARCH_EVENT));
    getSearchId.value = ''
    return searchData;
}


const getBookByTitle = (title) => {
    const findItem = booksData.find(item => item.title.toLowerCase() === title.toLowerCase())
    return findItem
}

const cardSearch = (data) => {
    const articleSearch = document.createElement('article');
    articleSearch.className = 'book-item';

    const bookItem = document.createElement('div');
    const titleSearch = document.createElement('h3');
    const authorSearch = document.createElement('p');
    const yearSearch = document.createElement('p');
    const statusSearch = document.createElement('p');
    const status = data.isComplete ? 'Sudah Selesai Dibaca' : 'Belum Dibaca'

    titleSearch.innerText = data.title;
    authorSearch.innerText = `Penulis: ${data.author}`;
    yearSearch.innerText = `Tahun Terbit: ${data.yearBook}`;
    statusSearch.innerText = `Status Buku: ${status}`;
    bookItem.append(titleSearch, authorSearch, yearSearch, statusSearch);
    articleSearch.append(bookItem);

    return articleSearch;
}

document.addEventListener(SEARCH_EVENT, () => {
    const searchSection = document.getElementById('searchSection');
    searchSection.innerHTML = '';

    const getSearch = document.getElementById('searchBookTitle').value;
    const searchData = getBookByTitle(getSearch);

    if (searchData != undefined) {
        searchSection.append(cardSearch(searchData))
    } else {
        alert('Buku tidak ditemukan!')
    }
})


const editData = (id) => {
    const getDataEdit = booksData.find(i => i.id === id);
    const inputTitle = document.getElementById('inputBookTitle');
    const inputAuthor = document.getElementById('inputBookAuthor');
    const inputYear = document.getElementById('inputBookYear');
    const isComplete = document.getElementById('inputBookIsComplete');
    const buttonEdit = document.getElementById('bookSubmit');
    buttonEdit.id = getDataEdit.id;


    const titleValue = getDataEdit.title;
    const authorValue = getDataEdit.author;
    const yearBookValue = getDataEdit.yearBook;
    const statusValue = getDataEdit.isComplete;

    inputTitle.value = titleValue;
    inputAuthor.value = authorValue;
    inputYear.value = yearBookValue;
    isComplete.checked = statusValue;
}



const updateData = (id) => {
    const parseId = parseInt(id);
    const getDataEdit = booksData.find(i => i.id === parseId);
    const getTitle = document.getElementById('inputBookTitle');
    const getAuthor = document.getElementById('inputBookAuthor');
    const getYear = document.getElementById('inputBookYear');
    const isComplete = document.getElementById('inputBookIsComplete');

    getDataEdit.title = getTitle.value;
    getDataEdit.author = getAuthor.value;
    getDataEdit.yearBook = getYear.value;
    getDataEdit.isComplete = isComplete.checked;

    saveToStorage();
    document.dispatchEvent(CUSTOM_EVENT);
    getTitle.value = '';
    getAuthor.value = '';
    getYear.value = '';
    isComplete.checked = false
}