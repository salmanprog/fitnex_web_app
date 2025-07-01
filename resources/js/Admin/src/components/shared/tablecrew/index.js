import React from 'react'
import { Table as AntdTable } from 'antd'
import actionsColumn from './actionsColumns';

function Table({ columns, data, actions = [],delete_opt = '',user = '' }) {
    return (
        <AntdTable
            columns={[...columns, actionsColumn(actions,delete_opt,user)]}
            dataSource={data}
            scroll={{
                x: 1300,
            }}
        />
    )
}

export default Table;