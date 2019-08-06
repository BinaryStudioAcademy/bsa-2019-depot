const issues = [
    // Mocks
    {
        id: 1,
        title: "Button doesn't respond",
        author: {
            username: 'papd'
        },
        assignees: [],
        labels: [
            {
                name: 'Bug',
                description: "Something doesn't work how it should",
                color: '#ee0000'
            }
        ],
        opened: true,
        commentCount: 2,
        createdAt: '2019-06-15 19:58:48.558000'
    }
];

export const getIssues = (from, to, { author, labels, assignees }) => {
    return issues
        .filter(issue => (author ? issue.author === author : true))
        .filter(issue => (labels.length ? labels.every(label => issue.labels.includes(label)) : true))
        .filter(issue => (assignees.length ? assignees.every(assignee => issue.assignees.includes(assignee)) : true))
        .slice(from - 1, to - 1);
};
