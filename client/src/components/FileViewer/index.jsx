import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

// Modes for code highlighting
import 'brace/mode/javascript';
import 'brace/mode/typescript';
import 'brace/mode/java';
import 'brace/mode/csharp';
import 'brace/mode/python';
import 'brace/mode/ruby';
import 'brace/mode/markdown';

import 'brace/theme/github';

const FileViewer = ({ content, style, fileExtension, readOnly, onChange }) => {
  const selectMode = extension => {
    switch (extension) {
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'java':
      return 'java';
    case 'cs':
      return 'csharp';
    case 'py':
      return 'python';
    case 'rb':
      return 'ruby';
    case 'md':
    default:
      return 'markdown';
    }
  };

  return (
    <AceEditor
      theme="github"
      value={content}
      mode={selectMode(fileExtension)}
      style={style}
      onChange={onChange}
      readOnly={readOnly}
      editorProps={{
        $blockScrolling: Infinity
      }}
    />
  );
};

FileViewer.propTypes = {
  content: PropTypes.string.isRequired,
  style: PropTypes.object,
  fileExtension: PropTypes.string,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool
};

FileViewer.defaultProps = {
  readOnly: false
};

export default FileViewer;
