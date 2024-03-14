const { nanoid } = require('nanoid');
const books = require('./books');

// get all books
const getAllBooksHandler = (request, h) => {
  if (books.length > 0) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
    response.code(200);

    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books,
    },
  });
  response.code(200);

  return response;
};

// get by id book
const getByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((n) => n.id === bookId)[0];

  // jika buku tidak ditemukan
  if (book === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);

    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);

  return response;
};

// add a new book
const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // jika nama buku tidak diisi
  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  // jika nilai readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  // jika data client sukses
  if (isSuccess) {
    const response = h.response({
      status: 'succes',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }

  // server error
  const response = h.response({
    status: 'fail',
    message: 'Maaf, terjadi kesalahan pada server kami, mohon bersabar',
  });
  response.code(500);

  return response;
};

// edit a book
const editBookHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  // mendapatkan index array sesuai dengan id yang ditentukan
  const index = books.findIndex((book) => book.id === bookId);

  // jika nama kosong
  if (name === undefined || name === '') {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  }

  // jika readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal memperbarui buku. readPage tidak boleh lebih dari pageCount',
    });
    response.code(400);

    return response;
  }

  // jika id tidak ditemukan
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);

    return response;
  }

  // jika berhasil
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
  response.code(200);

  return response;
};

// delete a book
const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);

    return response;
  }

  // jika id tidak ditemukan
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);

    return response;
  }
};

module.exports = {
  getAllBooksHandler,
  addBookHandler,
  getByIdHandler,
  editBookHandler,
  deleteBookHandler,
};
