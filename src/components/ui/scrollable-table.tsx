"use client";

import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { type ReactNode, useState } from "react";
import type { PaginationInfo } from "../../lib/pagination";
import { Input } from "./input";
import { PaginationComponent } from "./pagination";
import type { TableActionItem } from "./table-actions-dropdown";
import { TableActionsDropdown } from "./table-actions-dropdown";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  width?: string;
  sortable?: boolean;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
}

export interface TableAction<T = Record<string, unknown>> {
  label: string | ((record: T) => string);
  icon?: ReactNode | ((record: T) => ReactNode);
  onClick: (record: T) => void;
  variant?: "default" | "destructive";
  disabled?: (record: T) => boolean;
  hidden?: (record: T) => boolean;
  separator?: boolean;
}

export interface ScrollableTableProps<T = Record<string, unknown>> {
  // Data
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string | null;

  // Pagination
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPagination?: boolean;
  pageSizeOptions?: number[];

  // Search
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Sorting
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;

  // Actions
  actions?: TableAction<T>[];
  showActions?: boolean;
  actionsWidth?: string;
  actionsLabel?: string;

  // Styling
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string | ((record: T, index: number) => string);

  // Empty state
  emptyMessage?: string;
  emptyIcon?: ReactNode;

  // Selection
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (selectedIds: string[]) => void;
  rowKey?: string | ((record: T) => string);

  // Row events
  onRowClick?: (record: T, index: number) => void;
  onRowDoubleClick?: (record: T, index: number) => void;

  // Header actions
  headerActions?: ReactNode;
}

export function ScrollableTable<T = Record<string, unknown>>({
  data,
  columns,
  loading = false,
  error = null,

  // Pagination
  pagination,
  onPageChange,
  onPageSizeChange,
  showPagination = true,
  pageSizeOptions = [5, 10, 20, 50, 100],

  // Search
  searchable = true,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Buscar...",

  // Sorting
  sortBy,
  sortOrder,
  onSortChange,

  // Actions
  actions = [],
  showActions = true,
  actionsWidth = "80px",
  actionsLabel = "Acciones",

  // Styling
  className = "",
  tableClassName = "",
  headerClassName = "",
  rowClassName = "",

  // Empty state
  emptyMessage = "No hay datos disponibles",
  emptyIcon,

  // Selection
  selectable = false,
  selectedRows = [],
  onRowSelect,
  rowKey = "id",

  // Row events
  onRowClick,
  onRowDoubleClick,

  // Header actions
  headerActions,
}: ScrollableTableProps<T>) {
  const [localSearch, setLocalSearch] = useState(searchValue);

  const getRowKey = (record: T): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return (record as Record<string, unknown>)[rowKey] as string;
  };

  const getRowClassName = (record: T, index: number): string => {
    const baseClasses = "hover:bg-gray-50 transition-colors";
    const clickableClasses = onRowClick ? "cursor-pointer" : "";
    const selectedClasses =
      selectable && selectedRows.includes(getRowKey(record))
        ? "bg-blue-50"
        : "";

    if (typeof rowClassName === "function") {
      return `${baseClasses} ${clickableClasses} ${selectedClasses} ${rowClassName(record, index)}`.trim();
    }
    return `${baseClasses} ${clickableClasses} ${selectedClasses} ${rowClassName}`.trim();
  };

  const handleSort = (columnKey: string) => {
    if (!onSortChange) return;

    const newSortOrder =
      sortBy === columnKey && sortOrder === "asc" ? "desc" : "asc";
    onSortChange(columnKey, newSortOrder);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onRowSelect) return;

    if (checked) {
      const allIds = data.map(getRowKey);
      onRowSelect(allIds);
    } else {
      onRowSelect([]);
    }
  };

  const handleRowSelect = (recordId: string, checked: boolean) => {
    if (!onRowSelect) return;

    if (checked) {
      onRowSelect([...selectedRows, recordId]);
    } else {
      onRowSelect(selectedRows.filter((id) => id !== recordId));
    }
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onSearchChange?.(value);
  };

  const filteredData = data;
  const hasActions = showActions && actions.length > 0;
  const allSelected =
    selectable &&
    data.length > 0 &&
    data.every((record) => selectedRows.includes(getRowKey(record)));
  const someSelected = selectable && selectedRows.length > 0 && !allSelected;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search */}
        {searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={localSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Header Actions */}
        {headerActions && (
          <div className="flex items-center gap-2">{headerActions}</div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Cargando datos...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table
              className={`min-w-full divide-y divide-gray-200 ${tableClassName}`}
            >
              {/* Table Header */}
              <thead
                className={`bg-gradient-to-r from-gray-50 to-gray-100 ${headerClassName}`}
              >
                <tr>
                  {/* Selection Column */}
                  {selectable && (
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someSelected;
                        }}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                  )}

                  {/* Data Columns */}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.headerClassName || ""}`}
                      style={{ width: column.width }}
                    >
                      {column.sortable ? (
                        <button
                          onClick={() => handleSort(column.key)}
                          className="flex items-center space-x-1 hover:text-gray-700 transition-colors font-semibold"
                        >
                          <span>{column.title}</span>
                          {sortBy === column.key &&
                            (sortOrder === "asc" ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            ))}
                        </button>
                      ) : (
                        <span className="font-semibold">{column.title}</span>
                      )}
                    </th>
                  ))}

                  {/* Actions Column */}
                  {hasActions && (
                    <th
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                      style={{ width: actionsWidth }}
                    >
                      {actionsLabel}
                    </th>
                  )}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        (selectable ? 1 : 0) +
                        (hasActions ? 1 : 0)
                      }
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
                        <p>{emptyMessage}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record, index) => {
                    const recordKey = getRowKey(record);

                    return (
                      <tr
                        key={recordKey}
                        className={`${getRowClassName(record, index)} border-b border-gray-100 last:border-b-0`}
                        onClick={() => onRowClick?.(record, index)}
                        onDoubleClick={() => onRowDoubleClick?.(record, index)}
                      >
                        {/* Selection Cell */}
                        {selectable && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(recordKey)}
                              onChange={(e) =>
                                handleRowSelect(recordKey, e.target.checked)
                              }
                              onClick={(e) => e.stopPropagation()}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </td>
                        )}

                        {/* Data Cells */}
                        {columns.map((column) => {
                          const value = (record as Record<string, unknown>)[
                            column.key
                          ];

                          return (
                            <td
                              key={column.key}
                              className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${column.className || ""}`}
                            >
                              {column.render
                                ? column.render(value, record, index)
                                : String(value ?? "")}
                            </td>
                          );
                        })}

                        {/* Actions Cell */}
                        {hasActions && (
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <TableActionsDropdown
                              items={actions.map(
                                (action): TableActionItem => ({
                                  label:
                                    typeof action.label === "function"
                                      ? action.label(record)
                                      : action.label,
                                  icon:
                                    typeof action.icon === "function"
                                      ? action.icon(record)
                                      : action.icon,
                                  onClick: () => action.onClick(record),
                                  variant: action.variant,
                                  disabled: action.disabled?.(record),
                                  hidden: action.hidden?.(record),
                                  separator: action.separator,
                                }),
                              )}
                              align="right"
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {showPagination &&
          pagination &&
          !loading &&
          !error &&
          filteredData.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <PaginationComponent
                pagination={pagination}
                onPageChange={
                  onPageChange ||
                  (() => {
                    /* No pagination handler */
                  })
                }
                onLimitChange={
                  onPageSizeChange ||
                  (() => {
                    /* No page size handler */
                  })
                }
                limitOptions={pageSizeOptions}
              />
            </div>
          )}
      </div>
    </div>
  );
}
