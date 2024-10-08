import { useState } from "react";
import {
  useReactTable,
  getGroupedRowModel,
  getCoreRowModel,
  getExpandedRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import { makeData } from "./make-data";

const columnHelper = createColumnHelper();

const allSet = ["title", "firstName", "lastName", "age"];
const allAgg = ["sum", "mean", "max", "count", "nada"];
const data = makeData(10);
let avgIdx = -1;

function App() {
  const [grouping, setGrouping] = useState([]);
  const [aggregation, setAggregation] = useState({});

  const columns = [
    columnHelper.display({
      id: "expander",
      minSize: 4,
      cell: ({ row }) => {
        if (!row.getCanExpand()) return null;
        const text = row.getIsExpanded() ? "-" : ">";
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              row.toggleExpanded();
            }}
          >
            {text}
          </button>
        );
      },
    }),
    columnHelper.accessor("title", {
      header: "Title",
      cell: ({ getValue }) => <p>{getValue()}</p>,
      // getGroupingValue: row => row.title,
      aggregationFn: () => null,
    }),
    columnHelper.accessor("firstName", {
      header: "First Name",
      cell: ({ getValue }) => <p>{getValue()}</p>,
    }),
    columnHelper.accessor("lastName", {
      header: "Last Name",
      cell: ({ getValue }) => <p>{getValue()}</p>,
      aggregationFn: () => null,
    }),
    columnHelper.accessor("age", {
      header: "Age",
      cell: ({ getValue }) => <p>{getValue()}</p>,
      aggregationFn: aggregation["age"],
    }),
  ];

  const addGrouping = () => {
    const diff = allSet.filter(
      (item) => !grouping.find((pItem) => pItem === item)
    );
    if (diff.length > 0) {
      const newState = [...grouping, diff[0]];
      setGrouping(newState);
    }
  };

  const removeGrouping = () => {
    if (grouping.length > 0) {
      const newState = [...grouping];
      newState.pop();
      setGrouping(newState);
    }
  };

  const updateAggregation = () => {
    avgIdx += 1;
    setAggregation((old) => {
      const newVal = allAgg[avgIdx % 4];

      console.log("old state: ");
      console.log(old);

      console.log("new value: ", newVal);

      if (newVal === "nada") return {};

      return {
        age: newVal,
      };
    });
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
      <button onClick={updateAggregation}>Aggregate</button>
      <table>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

// import { useEffect, useState } from "react";

// const allAgg = ["sum", "mean", "max", "count", "nada"];
// let avgIdx = -1;

// function App() {
//   const [aggregation, setAggregation] = useState({});

//   const updateAggregation = () => {
//     setAggregation((old) => {
//       avgIdx += 1;
//       const newVal = allAgg[avgIdx % 4];

//       console.log("idx state in handler:", avgIdx);

//       if (newVal === "nada") return {};

//       return {
//         age: newVal,
//       };
//     });
//   };

//   useEffect(() => {
//     console.log("idx state in effect: ", avgIdx);
//   }, [aggregation]);

//   return <button onClick={updateAggregation}>Aggregate</button>;
// }

export default App;
