import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Form, Dropdown, Input, Radio, Checkbox, Divider, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { createRepository, checkRepoName } from '../../routines/routines';
import { statusOptions, checkNameOptions } from './reducer';

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

const initiaValues = {
    owner: '',
    repository: '',
    description: '',
    privacy: 'public',
    readme: false
};

class CreateRepository extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: statusOptions.createDisallowed,
            values: initiaValues
        };

        this.onChange = this.onChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.renderIcon = this.renderIcon.bind(this);
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            values: {
                ...this.state.values,
                owner: this.props.username
            }
        });
    }

    onChange(e) {
        const { name, value } = e.target;

        this.setState({
            ...this.state,
            values: {
                ...this.state.values,
                [name]: value
            }
        });

        if (name === 'repository') {
            this.props.checkRepoName(this.state.values);
        }
    }

    onRadioChange(e, { name, value }) {
        this.setState({
            ...this.state,
            values: {
                ...this.state.values,
                [name]: value
            }
        });
    }

    onCheckboxChange(e, { name, checked }) {
        this.setState({
            ...this.state,
            values: {
                ...this.state.values,
                [name]: checked
            }
        });
    }


    onSubmit() {
        this.props.createRepository({
            ...this.state.values,
            owner: this.props.username
        });
        const { repository } = this.state.values;
        const owner = this.props.username;
        this.props.history.push(`${owner}/${repository}`);
        this.setState({
            status: '',
            values: initiaValues
        });
    }

    renderIcon() {
        const { isValid } = this.props;

        switch (isValid) {
        case checkNameOptions.checking:
            return (<Icon loading name='spinner' />);
        case checkNameOptions.error:
            return (<Icon name='warning sign' color='red' />);
        case checkNameOptions.checked:
            return (<Icon name='check' color='green' className='' />);
        default:
            return null;
        }
    }

    render() {
        const { username } = this.props;
        const { repository, description, readme, privacy } = this.state.values;
        const { status } = this.props;

        return (
            <Container>
                <h1>Create a new repository</h1>
                <p>A repository contains all project files, including the revision history. Already have a project repository elsewhere?</p>
                <Link to="/">Import a repository.</Link>
                <Divider section/>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Field>
                            <label>Owner</label>
                            <Input value={username} />
                        </Form.Field>
                        <Form.Field required>
                            <label>Repository name</label>
                            <Input
                                icon
                                name="repository"
                                value={repository}
                                onChange={this.onChange}
                            >
                                <input />
                                {this.renderIcon()}

                            </Input>
                        </Form.Field>
                    </Form.Group>
                    <p>Great repository names are short and memorable. Need inspiration? How about psychic-eureka?</p>
                    <Form.Field>
                        <label>Description <small>(optional)</small></label>
                        <Input
                            name="description"
                            value={description}
                            onChange={this.onChange}
                        />
                    </Form.Field>
                    <Divider />
                    <div>
                        <Form.Field>
                            <Radio
                                label='Public'
                                name='privacy'
                                value='public'
                                checked={privacy === 'public'}
                                onChange={this.onRadioChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='Private'
                                name='privacy'
                                value='private'
                                checked={privacy === 'private'}
                                onChange={this.onRadioChange}
                            />
                        </Form.Field>
                        <Divider />
                    </div>
                    <Form.Field>
                        <Checkbox
                            label={'Initialize this repository with a README'}
                            name={'readme'}
                            checked={readme}
                            onChange={this.onCheckboxChange}
                        />
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
                        disabled={status === statusOptions.createDisallowed}
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

CreateRepository.propTypes = {
    username: PropTypes.string.isRequired,
    createRepository: PropTypes.func,
    checkRepoName: PropTypes.func,
    status: PropTypes.string.isRequired,
    isValid: PropTypes.string,
    history: PropTypes.any
};

const mapStateToProps = (state) => {
    return {
        username: state.profile.username,
        status: state.createRepository.status,
        isValid: state.createRepository.isValid
    };
};

const mapDispatchToProps = {
    createRepository,
    checkRepoName
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateRepository);
