import React, { useCallback, useEffect } from 'react';
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
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = null;
    //sss
    const editor = document.createElement('div');
    wrapper.append(editor);
    new Quill(editor, { theme: 'snow', modules: { toolbar: CUSTOM_OPTIONS } });
  }, []);

  return <div className='container' ref={wrapperRef}></div>;
};

export default Editor;
