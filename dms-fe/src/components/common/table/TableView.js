import React, {useEffect, useRef} from "react";
import {useTable, usePagination } from "react-table";

const TableView = ({elements = [], columnConfigs = [], columnVisibility = [], ignoreFirstColumn = true, currentPage, totalElement}) => {
    const data = React.useMemo(() => elements, [elements]);
    const columns = React.useMemo(() => columnConfigs, [columnConfigs]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({columns, data,
        manualPagination: true,
    }, usePagination);


    return (
        <table {...getTableProps()} className="min-w-full leading-normal">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th className="text-left px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semi bold text-gray-600 uppercase tracking-wider">
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

export default TableView;