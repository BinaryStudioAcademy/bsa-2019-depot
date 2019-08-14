import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Form, Radio } from 'semantic-ui-react';
/*import { getUserImgLink } from '../../helpers/imageHelper';*/

const CommitFileForm = ({ avatar, initialBranch, handleSubmit }) => {
  /*const [displayInput, setDisplayInput] = useState(false);
  const [newBranch, setNewBranch] = useState('');*/

  return (
    <Formik initialValues={{ message: '', branch: initialBranch }} onSubmit={handleSubmit}>
      {({ values: { message, branch }, handleChange }) => (
        <Form>
          <Form.Input name="message" value={message} placeholder="Enter commit message" fluid />
          <Form.Field>
            <Radio
              label={`Commit directly to the ${initialBranch} branch.`}
              name="branch"
              value={initialBranch}
              checked={branch === initialBranch}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label="Create a new branch for this commit."
              name="branch"
              /*value={newBranch}*/
              checked={branch !== initialBranch}
              onChange={handleChange}
            />
          </Form.Field>
        </Form>
      )}
    </Formik>
  );
};

CommitFileForm.propTypes = {
  username: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  initialBranch: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default CommitFileForm;
