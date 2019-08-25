module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;').then(() => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.createTable(
      'users',
      {
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
          type: Sequelize.STRING
        },
        name: {
          type: Sequelize.STRING
        },
        bio: {
          type: Sequelize.STRING
        },
        url: {
          type: Sequelize.STRING
        },
        company: {
          type: Sequelize.STRING
        },
        location: {
          type: Sequelize.STRING
        },
        imgUrl: {
          type: Sequelize.STRING
        },
        type: {
          allowNull: false,
          type: Sequelize.TEXT,
          defaultValue: 'USER'
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    ),
    queryInterface.createTable(
      'sshKeys',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        value: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING
        },
        fingerprint: {
          allowNull: false,
          type: Sequelize.STRING
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
      },
      { transaction }
    ),
    queryInterface.createTable(
      'repositories',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        name: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        userId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        description: {
          type: Sequelize.TEXT
        },
        forkedFromRepoId: {
          type: Sequelize.UUID
        },
        website: {
          type: Sequelize.STRING
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    ),
    queryInterface.createTable(
      'roles',
      {
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
      },
      { transaction }
    ),
    queryInterface.createTable(
      'orgUsers',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        orgId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'users',
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
        roleId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'roles',
            key: 'id'
          }
        },
        isActivated: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    ),
    queryInterface.createTable(
      'commits',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        sha: {
          allowNull: false,
          type: Sequelize.STRING
        },
        repositoryId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'repositories',
            key: 'id'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    ),
    queryInterface.createTable(
      'stars',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        userId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        repositoryId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'repositories',
            key: 'id'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    ),
    queryInterface.createTable(
      'commitComments',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        body: {
          allowNull: false,
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
      },
      { transaction }
    ),
    queryInterface.createTable(
      'issues',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        title: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        body: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        isOpened: {
          allowNull: false,
          type: Sequelize.BOOLEAN
        },
        userId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        repositoryId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'repositories',
            key: 'id'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    ),
    queryInterface.createTable(
      'issueComments',
      {
        id: {
          allowNull: false,
          autoIncrement: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()')
        },
        body: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        userId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        issueId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'issues',
            key: 'id'
          }
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
        deletedAt: Sequelize.DATE
      },
      { transaction }
    )
  ]))),
  down: queryInterface => queryInterface.sequelize.transaction(transaction => Promise.all([
    queryInterface.dropTable('issueComments', { transaction }),
    queryInterface.dropTable('issues', { transaction }),
    queryInterface.dropTable('commitComments', { transaction }),
    queryInterface.dropTable('stars', { transaction }),
    queryInterface.dropTable('commits', { transaction }),
    queryInterface.dropTable('orgUsers', { transaction }),
    queryInterface.dropTable('roles', { transaction }),
    queryInterface.dropTable('repositories', { transaction }),
    queryInterface.dropTable('sshKeys', { transaction }),
    queryInterface.dropTable('users', { transaction })
  ]))
};
