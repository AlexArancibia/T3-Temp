"use client";

import { type ReactNode } from "react";
import type { PaginationInfo } from "../../lib/pagination";
import { Alert, AlertDescription } from "./alert";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import { PaginationComponent } from "./pagination";
import { Skeleton } from "./skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import type { TableActionItem } from "./table-actions-dropdown";
import { TableActionsDropdown } from "./table-actions-dropdown";

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  width?: string;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  // Badge support
  badge?:
    | boolean
    | ((
        value: unknown,
        record: T,
      ) => {
        variant?: "default" | "secondary" | "destructive" | "outline";
        label: string;
      });
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
  const getRowKey = (record: T): string => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return (record as Record<string, unknown>)[rowKey] as string;
  };

  const getRowClassName = (record: T, index: number): string => {
    const baseClasses = "hover:bg-muted transition-colors";
    const clickableClasses = onRowClick ? "cursor-pointer" : "";
    const selectedClasses =
      selectable && selectedRows.includes(getRowKey(record)) ? "bg-muted" : "";

    if (typeof rowClassName === "function") {
      return `${baseClasses} ${clickableClasses} ${selectedClasses} ${rowClassName(record, index)}`.trim();
    }
    return `${baseClasses} ${clickableClasses} ${selectedClasses} ${rowClassName}`.trim();
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

  const filteredData = data;
  const hasActions = showActions && actions.length > 0;
  const allSelected =
    selectable &&
    data.length > 0 &&
    data.every((record) => selectedRows.includes(getRowKey(record)));
  const someSelected = selectable && selectedRows.length > 0 && !allSelected;

  return (
    <div className={`space-y-4 ${className} `}>
      {/* Header Actions */}
      {headerActions && (
        <div className="flex items-center gap-2 mb-4">{headerActions}</div>
      )}

      {/* Table Container */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {/* Loading State */}
        {loading && (
          <div className="space-y-0">
            {/* Header skeleton */}
            <div className="px-6 py-2.5 border-b border-border bg-muted/30">
              <div className="flex space-x-6">
                {selectable && <Skeleton className="h-4 w-4 rounded" />}
                {columns.map((_, index) => (
                  <Skeleton
                    key={`header-${index}`}
                    className="h-4 flex-1 max-w-[120px]"
                  />
                ))}
                {hasActions && <Skeleton className="h-4 w-16" />}
              </div>
            </div>

            {/* Rows skeleton */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="px-6 py-3 border-b border-border last:border-b-0"
              >
                <div className="flex space-x-6 items-center">
                  {selectable && <Skeleton className="h-4 w-4 rounded" />}
                  {columns.map((column, colIndex) => (
                    <Skeleton
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="h-4 flex-1"
                      style={{
                        maxWidth: column.width || "120px",
                        minWidth: "80px",
                      }}
                    />
                  ))}
                  {hasActions && <Skeleton className="h-8 w-8 rounded" />}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <Table className={tableClassName}>
            {/* Table Header */}
            <TableHeader
              className={`bg-muted/30 [&_tr]:border-b [&_tr]:border-border ${headerClassName}`}
            >
              <TableRow>
                {/* Selection Column */}
                {selectable && (
                  <TableHead className="px-6 py-2.5 text-left">
                    <Checkbox
                      checked={allSelected || someSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                )}

                {/* Data Columns */}
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`px-6 py-2.5 text-left text-xs font-normal text-muted-foreground/70 uppercase tracking-wide ${column.headerClassName || ""}`}
                    style={{ width: column.width }}
                  >
                    <span className="font-medium">{column.title}</span>
                  </TableHead>
                ))}

                {/* Actions Column */}
                {hasActions && (
                  <TableHead
                    className="px-6 py-2.5 text-center text-xs font-normal text-muted-foreground/70 uppercase tracking-wide"
                    style={{ width: actionsWidth }}
                  >
                    {actionsLabel}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="bg-card divide-y divide-border">
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (hasActions ? 1 : 0)
                    }
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center">
                      {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
                      <p>{emptyMessage}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((record, index) => {
                  const recordKey = getRowKey(record);

                  return (
                    <TableRow
                      key={recordKey}
                      className={`${getRowClassName(record, index)} border-b border-border last:border-b-0`}
                      onClick={() => onRowClick?.(record, index)}
                      onDoubleClick={() => onRowDoubleClick?.(record, index)}
                    >
                      {/* Selection Cell */}
                      {selectable && (
                        <TableCell className="px-6 py-3 whitespace-nowrap">
                          <Checkbox
                            checked={selectedRows.includes(recordKey)}
                            onCheckedChange={(checked) =>
                              handleRowSelect(recordKey, checked as boolean)
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                        </TableCell>
                      )}

                      {/* Data Cells */}
                      {columns.map((column) => {
                        const value = (record as Record<string, unknown>)[
                          column.key
                        ];

                        const renderContent = () => {
                          if (column.render) {
                            return column.render(value, record, index);
                          }

                          // Badge support
                          if (column.badge) {
                            if (typeof column.badge === "function") {
                              const badgeConfig = column.badge(value, record);
                              return (
                                <Badge
                                  variant={badgeConfig.variant || "default"}
                                >
                                  {badgeConfig.label}
                                </Badge>
                              );
                            } else {
                              return (
                                <Badge variant="default">
                                  {String(value ?? "")}
                                </Badge>
                              );
                            }
                          }

                          return String(value ?? "");
                        };

                        return (
                          <TableCell
                            key={column.key}
                            className={`px-6 py-3 whitespace-nowrap text-base text-muted-foreground ${column.className || ""}`}
                          >
                            {renderContent()}
                          </TableCell>
                        );
                      })}

                      {/* Actions Cell */}
                      {hasActions && (
                        <TableCell className="px-6 py-3 whitespace-nowrap text-center">
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
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {showPagination &&
          pagination &&
          !loading &&
          !error &&
          filteredData.length > 0 && (
            <div className="px-4 py-1.5 border-t border-border bg-muted/20">
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
