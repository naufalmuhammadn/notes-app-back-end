// eslint-disable-next-line import/no-extraneous-dependencies
const { nanoid } = require('nanoid');
const notes = require('./note');

const addNoteHandler = (request, h) => {
  // code yang di-POST oleh client
  const { title, tags, body } = request.payload;

  // code yang otomatis dari web
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  // masukin semua info ke objek
  const newNote = {
    title, tags, body, id, createdAt, updatedAt,
  };

  // masukin note baru ke array of notes
  notes.push(newNote);

  // ngecek apakah id sudah tesedia
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// trivia : kenapa ada () setelah arrow karena fungsinya png implicit return, jadi ga pake {}.
// tapi masalahnya kita pengen return object yg mana pake {}, jadinya perlu ditambahin dulu ({}).
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  // eslint-disable-next-line max-len
  // filter dulu arraynya, trs nanti ada 1 note yang terfilter, trs ambil pake [0] karena sudah pasti di indeks 0
  const note = notes.filter((n) => n.id === id)[0];

  // eslint-disable-next-line max-len
  // kenapa langsung return tanpa ada h.response()? returnnya bisa dikenali oleh server kalo itu sebuah response, sudah otomatis response.code(200)
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    // spread syntax pertama isi nilai lama dulu
    // kalo ga pake spread syntax, kita harus inisiasi satu2 nilai sebelumnya
    notes[index] = {
      ...notes[index],
      // kalo ada update data, inisiasi lagi nilai dalem notesnya
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
