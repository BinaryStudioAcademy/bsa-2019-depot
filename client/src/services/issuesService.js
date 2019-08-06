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
    }
];

export const getIssues = (from, to, { author, labels, assignees, opened }) => {
    return new Promise(resolve => {
    // Mocking server response
        const filteredIssues = issues
            .filter(issue => (author ? issue.author === author : true))
            .filter(issue => (labels.length ? labels.every(label => issue.labels.includes(label)) : true))
            .filter(issue => (assignees.length ? assignees.every(assignee => issue.assignees.includes(assignee)) : true))
            .filter(issue => issue.opened === opened)
            .slice(from, to);

        setTimeout(() => {
            resolve(filteredIssues);
        }, 500);
    });
};
