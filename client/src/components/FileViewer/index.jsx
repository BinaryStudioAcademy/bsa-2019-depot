import React from 'react';
import PropTypes from 'prop-types';
import AceEditor from 'react-ace';

// Modes for code highlighting
import 'brace/mode/javascript';
import 'brace/mode/jsx';
import 'brace/mode/typescript';
import 'brace/mode/json';
import 'brace/mode/java';
import 'brace/mode/c_cpp';
import 'brace/mode/csharp';
import 'brace/mode/golang';
import 'brace/mode/python';
import 'brace/mode/kotlin';
import 'brace/mode/ruby';
import 'brace/mode/sql';
import 'brace/mode/markdown';
import 'brace/mode/html';
import 'brace/mode/xml';
import 'brace/mode/yaml';
import 'brace/mode/css';
import 'brace/mode/sass';
import 'brace/mode/scss';
import 'brace/mode/less';
import 'brace/mode/text';

import 'brace/theme/github';

const FileViewer = ({ content, style, fileExtension, readOnly, onChange }) => {
  const selectMode = extension => {
    switch (extension) {
    case 'js':
      return 'javascript';
    case 'jsx':
      return 'jsx';
    case 'ts':
      return 'typescript';
    case 'json':
      return 'json';
    case 'java':
      return 'java';
    case 'c':
    case 'h':
    case 'cpp':
      return 'c_cpp';
    case 'cs':
      return 'csharp';
    case 'py':
      return 'python';
    case 'rb':
      return 'ruby';
    case 'kt':
    case 'kts':
      return 'kotlin';
    case 'go':
      return 'golang';
    case 'sql':
      return 'sql';
    case 'html':
      return 'html';
    case 'yml':
      return 'yaml';
    case 'xml':
      return 'xml';
    case 'css':
      return 'css';
    case 'scss':
      return 'scss';
    case 'sass':
      return 'sass';
    case 'less':
      return 'less';
    case 'md':
      return 'markdown';
    default:
      return 'text';
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
