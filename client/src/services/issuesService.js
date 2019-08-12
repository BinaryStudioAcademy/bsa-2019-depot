const issues = [
  // Mocks
  {
    id: 1,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'papd'
    },
    assignees: [],
    opened: true,
    commentCount: 2,
    createdAt: '2019-06-15 19:58:48.558000'
  },
  {
    id: 2,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'papd'
    },
    assignees: [
      {
        username: 'abcd',
        avatar: 'https://react.semantic-ui.com/logo.png'
      },
      {
        username: 'abc123d',
        avatar: ''
      }
    ],
    opened: true,
    commentCount: 5,
    createdAt: '2019-07-15 19:58:48.558000'
  },
  {
    id: 3,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'sdfsdf'
    },
    assignees: [],
    opened: true,
    commentCount: 7,
    createdAt: '2019-07-18 19:58:48.558000'
  },
  {
    id: 4,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'p234apd'
    },
    assignees: [],
    opened: true,
    commentCount: 2,
    createdAt: '2019-07-19 19:58:48.558000'
  },
  {
    id: 5,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'pa123pd'
    },
    assignees: [],
    opened: true,
    commentCount: 15,
    createdAt: '2019-07-25 20:58:48.558000'
  },
  {
    id: 6,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'pawfwefefpd'
    },
    assignees: [],
    opened: true,
    commentCount: 25,
    createdAt: '2019-07-26 19:58:48.558000'
  },
  {
    id: 7,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'pafwefpd'
    },
    assignees: [],
    opened: true,
    commentCount: 55,
    createdAt: '2019-07-15 19:58:48.558000'
  },
  {
    id: 8,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'papd'
    },
    assignees: [],
    opened: true,
    commentCount: 12,
    createdAt: '2019-07-15 19:58:48.558000'
  },
  {
    id: 9,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'papd'
    },
    assignees: [],
    opened: true,
    commentCount: 3,
    createdAt: '2019-07-15 19:58:48.558000'
  },
  {
    id: 10,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'papd'
    },
    assignees: [],
    opened: true,
    commentCount: 13,
    createdAt: '2018-08-23 19:58:48.558000'
  },
  {
    id: 11,
    title: "Button doesn't respond",
    text: 'Clicking on the login button does nothing',
    author: {
      username: 'papd'
    },
    assignees: [],
    opened: false,
    commentCount: 23,
    createdAt: '2018-08-23 19:58:48.558000'
  }
];

export const getIssues = ({ author, title, assignees, opened }) => {
  return new Promise(resolve => {
    // Mocking server response
    const filteredIssues = issues
      .filter(issue => (author ? issue.author === author : true))
      .filter(issue => (title ? issue.title.includes(title) : true))
      .filter(issue => (assignees.length ? assignees.every(assignee => issue.assignees.includes(assignee)) : true))
      .filter(issue => issue.opened === opened)
      .sort((issueA, issueB) => new Date(issueB.createdAt) - new Date(issueA.createdAt));

    setTimeout(() => {
      resolve(filteredIssues);
    }, 500);
  });
};
