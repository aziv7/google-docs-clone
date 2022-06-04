import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import { io } from 'socket.io-client';
import './style.css';
import 'quill/dist/quill.snow.css';
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
      console.log(changes);
    };

    if (quill != null) quill.on('text-change', textUpdateHandling);
    return () => {
      quill.off('text-change', textUpdateHandling);
    };
  }, [quill]);

  return <div className='container' ref={wrapperRef}></div>;
};

export default Editor;
