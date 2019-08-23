module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;').then(() => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      username: {
        type: Sequelize.STRING,
        unique: true
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        unique: false
      },
      name: {
        type: Sequelize.STRING,
        unique: false
      },
      bio: {
        type: Sequelize.STRING,
        unique: false
      },
      url: {
        type: Sequelize.STRING,
        unique: false
      },
      company: {
        type: Sequelize.STRING,
        unique: false
      },
      location: {
        type: Sequelize.STRING,
        unique: false
      },
      imgUrl: {
        type: Sequelize.STRING,
        unique: false
      },
      type: {
        allowNull: false,
        type: Sequelize.TEXT,
        unique: false,
        defaultValue: 'USER'
      },
      fake: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        unique: false,
        defaultValue: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction }),
    queryInterface.createTable('sshKeys', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      value: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.STRING
      },
      fingerprint: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction }),
    queryInterface.createTable('repositories', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      name: {
        type: Sequelize.TEXT
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      description: {
        type: Sequelize.TEXT,
        unique: false
      },
      forkedFromRepoId: {
        type: Sequelize.UUID
      },
      website: {
        type: Sequelize.STRING,
        unique: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction }),
    queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction }),
    queryInterface.createTable('orgUsers', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      orgId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      roleId: {
        type: Sequelize.UUID,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      isActivated: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        unique: false
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction }),
    queryInterface.createTable('commits', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      sha: {
        type: Sequelize.STRING
      },
      repoId: {
        type: Sequelize.UUID,
        references: {
          model: 'repositories',
          key: 'id'
        }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction }),
    queryInterface.createTable('stars', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      repositoryId: {
        type: Sequelize.UUID,
        references: {
          model: 'repositories',
          key: 'id'
        }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction }),
    queryInterface.createTable('commitComments', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      body: {
        type: Sequelize.STRING
      },
      commitId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'commits',
          key: 'id'
        }
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction }),
    queryInterface.createTable('issues', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      title: {
        type: Sequelize.TEXT
      },
      body: {
        type: Sequelize.TEXT
      },
      isOpened: {
        type: Sequelize.BOOLEAN
      },
      assignees: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      repositoryId: {
        type: Sequelize.UUID,
        references: {
          model: 'repositories',
          key: 'id'
        }
      },
      number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction }),
    queryInterface.createTable('issueComments', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      body: {
        type: Sequelize.TEXT
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      issueId: {
        type: Sequelize.UUID,
        references: {
          model: 'issues',
          key: 'id'
        }
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE
    }, { transaction })
  ]))),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.dropTable('users', { transaction }),
    queryInterface.dropTable('sshKeys', { transaction }),
    queryInterface.dropTable('repositories', { transaction }),
    queryInterface.dropTable('roles', { transaction }),
    queryInterface.dropTable('orgUsers', { transaction }),
    queryInterface.dropTable('commits', { transaction }),
    queryInterface.dropTable('stars', { transaction }),
    queryInterface.dropTable('commitComments', { transaction }),
    queryInterface.dropTable('issues', { transaction }),
    queryInterface.dropTable('issueComments', { transaction })
  ]))
};
