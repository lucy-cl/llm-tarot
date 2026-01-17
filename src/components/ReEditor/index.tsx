import React from 'react';
import { BoldExtension, ItalicExtension, UnderlineExtension } from 'remirror/extensions';
import { Remirror, useRemirror, OnChangeJSON, OnChangeJSONProps } from '@remirror/react';

const extensions = () => [new BoldExtension(), new ItalicExtension(), new UnderlineExtension()];

interface EditorProps {
    onChange?: any;
    initialContent?: string;
    content?: string;
  }
  
const Editor = ({ onChange }: EditorProps) => {
  const { manager, state } = useRemirror({
    extensions,
    content: '<p>Hi <strong>Friend</strong></p>',
    stringHandler: 'html',
    selection: 'end',
  });

  return (
    <Remirror manager={manager} initialContent={state} placeholder='Enter text...'>
      <OnChangeJSON onChange={onChange} />
    </Remirror>
  );
};

export default Editor;