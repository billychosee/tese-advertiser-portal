"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { cn } from "@/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  emptyMessage = "No data available",
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <Card className={cn("p-6 text-center text-muted-foreground", className)}>
        {emptyMessage}
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-medium text-muted-foreground",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-muted/50 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-sm text-foreground",
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(item)
                      : String(item[column.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default DataTable;
