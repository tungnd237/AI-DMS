import React, {useEffect} from "react";
import {usePagination, useTable} from "react-table";
import { v4 as uuidv4 } from 'uuid';


const DynamicTableView = ({
                              elements = [],
                              columnConfigs = [],
                              columnVisibility = [],
                              ignoreFirstColumn = true,
                              currentPage,
                              totalElement
                          }) => {
    const data = React.useMemo(() => elements, [elements]);
    const columns = React.useMemo(() => columnConfigs, [columnConfigs]);
    const hiddenColumns = React.useMemo(() => {
        const offset = ignoreFirstColumn ? 1 : 0;
        return columnConfigs
            .filter((col, index) => {
                if (index === 0) return !ignoreFirstColumn;
                return !columnVisibility[index - offset]
            })
            .map(col => col.id)
    }, [columnVisibility])
    // useTraceUpdate({columnConfigs});
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setHiddenColumns
    } = useTable({
        columns, data,
        manualPagination: true,
        initialState: {hiddenColumns: hiddenColumns}
    }, usePagination);

    useEffect(() => {
        const offset = ignoreFirstColumn ? 1 : 0;
        const hiddenColumns = columnConfigs
            .filter((col, index) => {
                if (index === 0) return !ignoreFirstColumn;
                return !columnVisibility[index - offset]
            })
            .map(col => col.id);
        setHiddenColumns(hiddenColumns);
    }, [setHiddenColumns, columnVisibility, data]);

    return (
        <table {...getTableProps()} className="min-w-full leading-normal">
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th key={uuidv4()}  className="text-left px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semi bold text-gray-600 uppercase tracking-wider">
                            {column.render('Header')}
                        </th>
                    ))}
                </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row);
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            return (
                                <td
                                    {...cell.getCellProps({
                                        style: {
                                            maxWidth: cell.column.maxWidth,
                                            minWidth: cell.column.minWidth,
                                            direction: cell.column.direction,
                                            width: cell.column.width,
                                            whiteSpace: cell.column.whiteSpace,
                                            textOverflow: cell.column.textOverflow,
                                            overflow: cell.column.overflow
                                        },
                                    })}
                                    className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                    {cell.render('Cell')}
                                </td>
                            )
                        })}
                    </tr>
                );
            })}
            </tbody>
        </table>
    )
};

export default DynamicTableView;