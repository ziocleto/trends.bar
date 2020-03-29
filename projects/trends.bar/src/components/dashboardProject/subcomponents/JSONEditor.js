import {Controlled as CodeMirror} from "react-codemirror2";
import React, {useGlobal} from "reactn";
import {Fragment} from "react";

export const JSONEditor = () => {

  const [files, setFiles] = useGlobal('JSONFiles');
  const [currFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [, setFileJson] = useGlobal('JSONFileJson');
  const [isJsonValid, setIsJsonValid] = useGlobal('JSONValidator');

  const getCurrFile = () => {
    if (files) {
      for ( const file of files ) {
        if ( file.filename === currFileIndex ) return file;
      }
    }
    return null;
  };

  const getCurrFileText = () => {
    if (files) {
      for ( const file of files ) {
        if ( file.filename === currFileIndex ) return file.text;
      }
    }
    return "";
  };

  const setCurrFile = (value) => {
    if (files) {
      let newFiles = files;
      newFiles.map( (elem) => {
        if ( elem.filename === currFileIndex ) {
          elem.text = value;
        }
        return elem;
      });
      setFiles(newFiles);
    }
  }

  const update = (value) => {
    try {
      setFileJson(JSON.parse(value)).then();
      if (!isJsonValid) setIsJsonValid(true).then();
    } catch (e) {
      if (isJsonValid) setIsJsonValid(false).then();
    }
  }

  const data = getCurrFile();

  if ( !data ) {
    return <Fragment/>
  }

  return (
    <CodeMirror
      value={getCurrFileText()}
      options={{
        mode: "application/json",
        theme: "material",
        lint: true,
        gutters: ["CodeMirror-lint-markers"],
        styleActiveLine: true,
        lineNumbers: false,
        line: true
      }}
      editorDidMount={() => {
        setCurrFile(data.text);
        update(data.text);
      }}
      onBeforeChange={(editor, data, value) => {
        setCurrFile(value);
      }}
      onChange={(editor, data, value) => {
        update(editor.getValue());
      }}
    />
  )
};
