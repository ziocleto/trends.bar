import {Controlled as CodeMirror} from "react-codemirror2";
import React, {useGlobal} from "reactn";
import {Fragment} from "react";

export const JSONEditor = () => {

  const [files] = useGlobal('JSONFiles');
  const [currFileIndex] = useGlobal('JSONFileCurrentIndex');
  const [fileC, setFileC] = useGlobal('JSONFileC');
  const [, setFileJson] = useGlobal('JSONFileJson');
  const [isJsonValid, setIsJsonValid] = useGlobal('JSONValidator');

  const getCurrFile = () => {
    if (files) {
      for ( const file of files ) {
        if ( file.filename === currFileIndex ) return file;
      }
    }
    return null;
  }

  const data = getCurrFile();

  if ( !data ) {
    return <Fragment/>
  }

  return (
    <CodeMirror
      value={fileC}
      options={{
        mode: "application/json",
        theme: "material",
        lint: true,
        gutters: ["CodeMirror-lint-markers"],
        styleActiveLine: true,
        lineNumbers: false,
        line: true
      }}
      editorDidMount={() => setFileC(data ? data.text : "{}")}
      onBeforeChange={(editor, data, value) => {
        setFileC(value).then();
      }}
      onChange={(editor, data, value) => {
        try {
          setFileJson(JSON.parse(editor.getValue())).then();
          if (!isJsonValid) setIsJsonValid(true).then();
        } catch (e) {
          if (isJsonValid) setIsJsonValid(false).then();
        }
      }}
    />
  )
};
