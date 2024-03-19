const { nanoid } = require('nanoid');
const books = require('./books');

// get all books
const getAllBooksHandler = (request, h) => {
  // cek status finished
  const { finished } = request.query;

  // filter status finished
  if (finished !== undefined || finished === '') {
    if (finished === '1') {
      const resFinishedBooks = books.filter((book) => book.finished === true);

      const response = h.response({
        status: 'success',
        data: {
          books: resFinishedBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);

      return response;
    }

    if (finished === '0') {
      const resFinishedBooks = books.filter((book) => book.finished === false);

      const response = h.response({
        status: 'success',
        data: {
          books: resFinishedBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);

      return response;
    } else {
      const response = h.response({
        status: 'fail',
        message: 'Nilai finished tidak valid',
      });
      response.code(400);

      return response;
    }
  }

  // cek status reading
  const { reading } = request.query;

  // filter berdasarkan status pembacaan
  if (reading !== undefined || reading === '') {
    if (reading === '1') {
      const resReadingBooks = books.filter((book) => book.reading === true);

      const response = h.response({
        status: 'success',
        data: {
          books: resReadingBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);

      return response;
    }

    if (reading === '0') {
      const resReadingBooks = books.filter((book) => book.reading === false);

      const response = h.response({
        status: 'success',
        data: {
          books: resReadingBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);

      return response;
    } else {
      const response = h.response({
        status: 'fail',
        message: 'Nilai reading tidak valid',
      });
      response.code(400);

      return response;
    }
  }

  // cari berdasarkan query nama
  const { name } = request.query;

  // cek query param nama
  if (!(name === undefined || name === '')) {
    const filteredBooks = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );

    // jika nama buku ditemukan
    if (filteredBooks.length > 0) {
      const response = h.response({
        status: 'success',
        data: {
          books: filteredBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
      response.code(200);

      return response;
    } else {
      // jika nama buku tidak ditemukan
      const response = h.response({
        status: 'fail',
        message: 'Nama buku tidak ditemukan',
      });
      response.code(404);

      return response;
    }
  } else {
    // cek data buku
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

    return {
      status: 'success',
      data: {
        books: books,
      },
    };
  }
};

// get by id book
const getByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((n) => n.id === bookId);

  // jika buku tidak ditemukan
  if (!book) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);

    return response;
  }

  // jika buku ditemukan
  return {
    status: 'success',
    data: {
      book: book,
    },
  };
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
      status: 'success',
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
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
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
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);

  return response;
};

module.exports = {
  getAllBooksHandler,
  addBookHandler,
  getByIdHandler,
  editBookHandler,
  deleteBookHandler,
};
