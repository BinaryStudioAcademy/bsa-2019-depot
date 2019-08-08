import React from 'react';
import { Container, Form, Dropdown, Input, Radio, Checkbox, Divider, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ownerOptions = [
    {
        key: 'John Doe',
        text: 'John Doe',
        value: 'John Doe',
        image: { avatar: true, src: 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg' },
    }
];

const gitingnoreOptions = [
    {
        key: 'None',
        text: 'None',
        value: 'None'
    },
    {
        key: 'Actionscript',
        text: 'Actionscript',
        value: 'Actionscript'
    }
];

const licenseOptions = [
    {
        key: 'None',
        text: 'None',
        value: 'None'
    },
    {
        key: 'Apache License 2.0',
        text: 'Apache License 2.0',
        value: 'Apache License 2.0'
    }
];

class CreateRepository extends React.Component {
    render() {
        return (
            <Container>
                <h1>Create a new repository</h1>
                <p>A repository contains all project files, including the revision history. Already have a project repository elsewhere?</p>
                <Link to="/">Import a repository.</Link>
                <Divider section/>
                <Form>
                    <Form.Group>
                        <Form.Field>
                            <label>Owner</label>
                            <Dropdown
                                selection
                                options={ownerOptions}
                                defaultValue={ownerOptions[0].value}
                            />
                        </Form.Field>
                        <Form.Field required>
                            <label>Repository name</label>
                            <Input />
                        </Form.Field>
                    </Form.Group>
                    <p>Great repository names are short and memorable. Need inspiration? How about psychic-eureka?</p>
                    <Form.Field>
                        <label>Description <small>(optional)</small></label>
                        <Input></Input>
                    </Form.Field>
                    <Divider />
                    <div>
                        <Form.Field>
                            <Radio
                                label='Public'
                                name='privacy'
                                value='public'
                                defaultChecked
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Private'
                                name='privacy'
                                value='private'
                            />
                        </Form.Field>
                        <Divider />
                    </div>
                    <Form.Field>
                        <Checkbox label={'Initialize this repository with a README'} />
                    </Form.Field>
                    <Form.Group>
                        <Form.Field>
                            <label>Add .gitignore:</label>
                            <Dropdown
                                selection
                                options={gitingnoreOptions}
                                defaultValue={gitingnoreOptions[0].value}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Add a license:</label>
                            <Dropdown
                                selection
                                options={licenseOptions}
                                defaultValue={licenseOptions[0].value}
                            />
                        </Form.Field>
                    </Form.Group>
                    <Divider />
                    <Button
                        type='submit'
                        color='green'
                    >
                        Create repository
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default CreateRepository;
