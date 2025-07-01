import React from 'react'

export const users = [
    {
        title: 'Full Name',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        // fixed: 'left',
    },
    {
        title: 'Age',
        width: 100,
        dataIndex: 'age',
        key: 'age',
        // fixed: 'left',
        sorter: true,
    },
    {
        title: 'Column 1',
        dataIndex: 'address',
        key: '1',
    },
    {
        title: 'Column 2',
        dataIndex: 'address',
        key: '2',
    },
    {
        title: 'Column 3',
        dataIndex: 'address',
        key: '3',
    },
    {
        title: 'Column 4',
        dataIndex: 'address',
        key: '4',
    },
    {
        title: 'Column 5',
        dataIndex: 'address',
        key: '5',
    },
    {
        title: 'Column 6',
        dataIndex: 'address',
        key: '6',
    },
    {
        title: 'Column 7',
        dataIndex: 'address',
        key: '7',
    },
    {
        title: 'Column 8',
        dataIndex: 'address',
        key: '8',
    },
    {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => <a>action</a>,
    },
];

export const application_content = [
    {
        title: 'Title',
        width: 200,
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
    },
    {
        title: 'Slug',
        dataIndex: 'slug',
        key: 'slug',
    },
    {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: 'Created at',
        dataIndex: 'created_at',
        key: 'created_at',
    },
]

export const faqs = [
    {
        title: 'Question',
        dataIndex: 'question',
        key: 'question',
    },
    {
        title: 'Answer',
        dataIndex: 'answer',
        key: 'answer',
    },
    {
        title: 'Created at',
        dataIndex: 'created_at',
        key: 'created_at',
    },

]
