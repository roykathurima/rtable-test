import { useState } from 'react'
import { useReactTable, getGroupedRowModel, getCoreRowModel, getExpandedRowModel, createColumnHelper, flexRender } from '@tanstack/react-table';
import { makeData } from './make-data';


const columnHelper = createColumnHelper();

const allSet = ['title', 'firstName', 'lastName', 'age'];
const data = makeData(10);

function App() {
  const [grouping, setGrouping] = useState([]);
  const columns = [
    columnHelper.display({
      id: 'expander',
      minSize: 4,
      cell: ({ row }) => {
        if (!row.getCanExpand()) return null;
        const text = row.getIsExpanded() ? "-" : ">"
        return (
          <button onClick={(e) => {
            e.stopPropagation();
            row.toggleExpanded();
          }}>{text}</button>
        );
      }
    }),
    columnHelper.accessor('title', {
      header: 'Title',
      cell: ({ getValue }) => <p>{getValue()}</p>,
      // getGroupingValue: row => row.title,
      aggregationFn: () => null,
    }),
    columnHelper.accessor('firstName', {
      header: 'First Name',
      cell: ({ getValue }) => <p>{getValue()}</p>,
    }),
    columnHelper.accessor('lastName', {
      header: 'Last Name',
      cell: ({ getValue }) => <p>{getValue()}</p>,
      aggregationFn: () => null,
    }),
    columnHelper.accessor('age', {
      header: 'Age',
      cell: ({ getValue }) => <p>{getValue()}</p>,
      aggregationFn: (_, leafRows, childRows) => {
        // console.log(leafRows);
        // console.log(childRows);
        const leafRowDepths = new Set();
        const childRowDepths = new Set();
        leafRows.forEach(rw => {
          leafRowDepths.add(rw.depth);
        });
        childRows.forEach(rw => {
          childRowDepths.add(rw.depth);
        });
    
        console.log('leaf row depth: ');
        console.log(leafRowDepths);
        console.log('child row depths: ');
        console.log(childRowDepths);
        let groupingValue;
        const tableInstance = leafRows[0].getAllCells()[0].getContext().table;
    
        const gRows = tableInstance.getGroupedRowModel().flatRows;
    
        for (let gRow of gRows) {
          const child = gRow.subRows.find(item => item.id === childRows[0].id);
          if (child) {
            groupingValue = gRow.groupingValue;
          }
        }
        return groupingValue;
      }
    }),
  ];

  const addGrouping = () => {
    const diff = allSet.filter(item => !grouping.find(pItem => pItem === item));
    if (diff.length > 0) {
      const newState = [...grouping, diff[0]];
      setGrouping(newState)
    }
  };

  const removeGrouping = () => {
    if (grouping.length > 0) {
      const newState = [...grouping];
      newState.pop();
      setGrouping(newState);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: { grouping },
    groupedColumnMode: false,
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
  });

  return (
    <main>
    <button onClick={addGrouping}>Add Grouping</button>
    <button onClick={removeGrouping}>Remove Grouping</button>
    <table>
      <thead>
      {table.getHeaderGroups().map(hg => (
        <tr key={hg.id}>
          {hg.headers.map(header => (
            <th key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </main>
  )
}

export default App
