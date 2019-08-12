import React from 'react';
import {flatMap} from 'lodash';
import {parseDiff, Diff, Hunk, Decoration} from 'react-diff-view';

import styles from 'react-diff-view/style/index.css';
const text = `
diff --git a/client/package.json b/client/package.json
index 142cb14..72d33f5 100644
--- a/client/package.json
+++ b/client/package.json
@@ -6,5 +6,6 @@
   "dependencies": {
-    "dotenv": "^8.0.0",
     "@primer/octicons-react": "^9.1.1",
+    "dotenv": "^8.0.0",
     "immutable": "^4.0.0-rc.12",
+    "lodash": "^4.17.15",
     "moment": "^2.24.0",
@@ -16,2 +17,4 @@
     "react-copy-to-clipboard": "^5.0.1",
+    "react-diff-view": "^2.1.4",
+    "react-diff-viewer": "^2.0.1",
     "react-dom": "^16.8.6",`;


const DiffCommitView = () => {
  const files = parseDiff(text);

  const renderHunk =( newPath,hunk) => [
    <Decoration key={ hunk.content}>
      {newPath}
    </Decoration>,
    <Decoration key={'decoration-' + hunk.content}>
      {hunk.content}
    </Decoration>,
    <Hunk key={ hunk.content} hunk={hunk} />
      ];
  const DiffFile = ({diffType, hunks}) => (
    <Diff viewType="split" diffType={diffType}>
      {flatMap(hunks, renderHunk)}
    </Diff>
  );
  const renderFile = ({newPath, oldRevision, newRevision, type, hunks}) => (
    <Diff key={oldRevision + '-' + newRevision} viewType="unified" diffType={type} hunks={hunks}>
      {hunks => hunks.flatMap(h=>renderHunk(newPath, h ) )}
    </Diff>
  );

  return (
    <div>
      {files.map(renderFile)}
    </div>
  );
};

export default DiffCommitView;
