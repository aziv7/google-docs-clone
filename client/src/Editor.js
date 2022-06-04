import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import { io } from 'socket.io-client';
import './style.css';
import 'quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
const CUSTOM_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
];

const Editor = () => {
  const { id } = useParams();
  console.log(id);
  const [socket, setSocket] = useState();

  const [quill, setQuill] = useState();

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = null;

    const editor = document.createElement('div');
    wrapper.append(editor);
    const texteditor = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: CUSTOM_OPTIONS },
    });
    texteditor.disable();
    texteditor.setText('Loading content ...');
    setQuill(texteditor);
  }, []);

  useEffect(() => {
    const socket_ = io('http://localhost:4002');
    setSocket(socket_);
    return () => {
      socket_.disconnect();
    };
  }, []);

  //detecting quill change

  useEffect(() => {
    const textUpdateHandling = (changes, oldChanges, source) => {
      if (source !== 'user') return;

      socket.emit('text-editor-changes', changes);
      console.log(changes);
    };

    if (quill != null && socket != null)
      quill.on('text-change', textUpdateHandling);
    return () => {
      if (quill != null) quill.off('text-change', textUpdateHandling);
    };
  }, [quill, socket]);

  useEffect(() => {
    const receivingChanges = (changes) => {
      quill.updateContents(changes);
    };

    if (quill != null && socket != null)
      socket.on('changes-received', receivingChanges);
    return () => {
      if (quill != null) quill.off('changes-received', receivingChanges);
    };
  }, [quill, socket]);

  useEffect(() => {
    const receivingChanges = (changes) => {
      quill.updateContents(changes);
    };

    if (quill != null && socket != null) {
      socket.once('get-doc', (doc) => {
        console.log('here', doc);
        quill.setContents(doc);
        quill.enable();
      });

      socket.emit('fetch-doc', { docId: id });
    }
    return () => {
      if (quill != null) quill.off('changes-received', receivingChanges);
    };
  }, [socket, id, quill]);

  useEffect(() => {
    let handleSave;
    if (quill != null && socket != null) {
      handleSave = setInterval(
        () => socket.emit('save-doc', quill.getContents()),
        3000
      );
    }
    return () => {
      clearInterval(handleSave);
    };
  }, [socket, quill]);

  return <div className='container' ref={wrapperRef}></div>;
};

export default Editor;
