"use client";

import {
  AccessorColumnDef,
  ColumnDef,
  ColumnDefResolved,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow, } from "./table";

import ClearAll from "../../public/asserts/ClearAll";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/ui/button";
import { Checkbox } from "./checkbox";
import { DropdownMenu, DropdownMenuContent,
    DropdownMenuTrigger, } from "./dropdown-menu";
import { Select, SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue, } from "./select";

import DropDown from "../../public/asserts/DropDown";
import { useTranslation } from "next-i18next";
interface IBaseTable<TData, TValue> {
  /**
   * Columns defined for the table
   */
  columns: ColumnDef<TData, TValue>[];

  /**
   * Array of data objects to be displayed in the table
   */
  data: TData[];

  /**
   * Additional CSS classes to apply to the table
   */
  tableStyles?: {
    /**
     * Additional CSS classes to pass to the table container
     */
    table?: string;
    /**
     * Additional CSS classes to pass to each row
     */
    rowStyles?: string;
    /**
     * Additional CSS classes to pass to table container
     */
    tableContainer?: string;
    /**
     * Additional CSS classes to pass to table header
     */
    tableHeader?: string;
    /**
     * Additional Css classes to pass to each cell in the table header
     */
    tableHeaderCell?: string;
    /**
     * Additional Css classes to pass to each cell in the table body
     */
    tableBodyCell?: string;
  };
  /**
   * When there are no results then we have to show this placeholder
   */
  noRecordsPlaceholder?: string;
  /**

  /**
   * Function to update the current page number
   */
  setCurrent?: (value: React.SetStateAction<number>) => void;

  /**
   * The current page
   */
  current?: number;

  /**
   * Total number of pages
   */
  pageCount?: number;

  /**
   * Function to update the page size
   */
  setPageSize?: (value: React.SetStateAction<number>) => void;

  /**
   * Number of items to display per page
   */
  pageSize?: number;

  /**
   * Total number of items in the dataset
   */
  total?: number;

  /**
   * Flag to indicate whether pagination controls should be displayed
   */
  pagination?: boolean;

  /**
   * Flag to indicate whether checkboxes should be displayed
   */
  checkboxSelection?: boolean;

  /**
   * Flag to indicate whether sticky coulmns should be displayed
   */
  columnPinning?: boolean;

  /**
   * It is used to send the default columns to be selected
   */
  defaultColumns?: string[];

  /**
   * Row selection state
   */
  rowSelection?: RowSelectionState;

  /**
   * Function to update the row selection state to track the selected rows
   */
  setRowSelection?: (value: React.SetStateAction<RowSelectionState>) => void;
  /**
   * Flag to indicate whether the column selector need to be displayed or not
   */
  columnSelector?: boolean;

  setSorting?: any;

  sorting?: SortingState;

  /**
   * This variable is used to display the loader in middle of the page and while filtering ideally we dont need to click anything
   */
  isFiltering?: boolean;
  /**
   * This variable is used to disabled the horizontal scrolling.
   */
  noScroll?: boolean;

  /**
   * This variable is used pass action component if any. E.g: Bulk Actions in participant listing home page.
   */
  actionComponent?: React.ReactNode;

  /**
   * This variable is used to pass the columns preferences selected by the logged in user
   */
  userColumnPreferences?: { [key: string]: boolean } | null;

  tableContainerId?: string;

  /**
   * Function to update the columns selected and applied by the user
   */
  handleUserColumnPreferences?: (
    userColumnPreferences: { [key: string]: boolean } | null
  ) => void;

  /**
   * This is used to export the table for export excel and csv functionality
   */
  tableId?: string;
}

export function BaseTable<TData, TValue>({
  columns,
  data,
  tableStyles,
  current,
  setCurrent = () => {},
  pageCount,
  total = 0,
  setPageSize = () => {},
  pageSize = 0,
  pagination = false,
  checkboxSelection,
  columnPinning = false,
  defaultColumns = [],
  rowSelection,
  setRowSelection,
  columnSelector,
  sorting,
  setSorting,
  noRecordsPlaceholder = "No results",
  isFiltering = false,
  noScroll,
  actionComponent,
  userColumnPreferences,
  tableContainerId = "base-table-container",
  handleUserColumnPreferences,
  tableId = "",
}: IBaseTable<TData, TValue>) {
  // Initial visibility state for column selector
  const initialColumnVisibilityChanges: { [key: string]: boolean } =
    columns.reduce(
      (acc: Record<string, boolean>, { accessorKey, enableHiding }: any) => {
        if (accessorKey) {
          // Determine initial visibility for the current column
          acc[accessorKey] =
            // If the defaultColumns array is empty or includes the current column's accessorKey, set visibility to true
            defaultColumns.length === 0 || defaultColumns.includes(accessorKey)
              ? true
              : // If enableHiding is true for the current column, set visibility to false, otherwise set it to true
              enableHiding
              ? false
              : true;
        }
        return acc;
      },
      {}
    );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      userColumnPreferences
        ? userColumnPreferences
        : initialColumnVisibilityChanges
    );

  //Local state for column selector to apply chnages when we click on apply button
  const [columnVisibilityChanges, setColumnVisibilityChanges] =
    useState<VisibilityState>(
      userColumnPreferences
        ? userColumnPreferences
        : initialColumnVisibilityChanges
    );

  //initial state for select all checkbox
  const initialSelectAll =
    Object.keys(columnVisibilityChanges).length > 0 &&
    Object.values(columnVisibilityChanges).every(Boolean);

  const [selectAll, setSelectAll] = useState(initialSelectAll);

  /**
   * @function getRowId
   * @description this function return id if the row have the id else it will return the index as id
   * @param originalRow
   * @param index
   * @returns index in string format
   */
  const getRowId = (originalRow: any, index: number) => {
    if (checkboxSelection) {
      return originalRow.id.toString();
    } else {
      return index.toString();
    }
  };
  // table hook
  const table = useReactTable({
    data,
    columns: columns,
    enableSortingRemoval: true,
    sortDescFirst: false,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId,
    manualSorting: true,
    state: {
      columnVisibility,
      rowSelection,
      sorting,
    },
    onSortingChange: setSorting,
  });

  /**
   * Function to handle the select all checkbox changes
   */
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);

    const newColumnVisibilityChanges: VisibilityState = {};

    //Logic for not uncheck the columns which cannot be hidden they should be always true
    Object.keys(columnVisibilityChanges).forEach((columnId) => {
      const column = columns?.find(
        (column: any) => column.accessorKey === columnId
      );
      const canHide = column?.enableHiding;
      newColumnVisibilityChanges[columnId] = canHide === false ? true : checked;
    });

    setColumnVisibilityChanges(newColumnVisibilityChanges);
  };

  /**
   * function to handle the columns in column selector
   */
  const handleColumnVisibilityChange = (
    columnId: string,
    isVisible: boolean
  ) => {
    setColumnVisibilityChanges((prevState) => ({
      ...prevState,
      [columnId]: isVisible,
    }));

    // when i uncheck the individual check box we need to see if all checkboxes or checked or not and we have to update the select all
    const allChecked = Object.values({
      ...columnVisibilityChanges,
      [columnId]: isVisible,
    }).every(Boolean);
    setSelectAll(allChecked);
  };

  /**
   * function to handle the columns in column selector
   */
  const applyColumnVisibilityChanges = () => {
    table.setColumnVisibility(columnVisibilityChanges);
    handleUserColumnPreferences?.(columnVisibilityChanges);
    setOpen(false);
  };

  /**
   * functions to clear the columns in column selector
   */
  const clearColumnVisibilityChanges = () => {
    const finalColumnVisibilityChanges = columns.reduce(
      (acc: Record<string, boolean>, column: any) => {
        //When clearing we need to make sure that columns which are not been hidden need to be true always
        if (column.accessorKey) {
          if (column.enableHiding == false) {
            acc[column.accessorKey] = true;
          } else {
            acc[column.accessorKey] = false;
          }
        }
        return acc;
      },
      {}
    );

    setColumnVisibilityChanges(finalColumnVisibilityChanges);
    setColumnVisibility(finalColumnVisibilityChanges);
    handleUserColumnPreferences?.(finalColumnVisibilityChanges);
    setSelectAll(false);
  };

  const [scrollLeft, setScrollLeft] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  /**
   * function to move the scroll bar to left using controls in action
   */
  const handlePrevButtonClick = () => {
    if (tableRef.current) {
      tableRef.current.scrollLeft -= 100;
      setScrollLeft(tableRef.current.scrollLeft);
    }
  };

  /**
   * function to move the scroll bar to right using controls in action
   */
  const handleNextButtonClick = () => {
    if (tableRef.current) {
      tableRef.current.scrollLeft += 100;
      setScrollLeft(
        tableRef.current.scrollWidth - tableRef.current.clientWidth
      );
    }
  };

  //state variable to control the opening and closing of the column selector
  const [open, setOpen] = useState(false);
  const { t } = useTranslation(["common", "course.find_course", "bx_v1"]);

  /**
   * This function will set the drop down to open or close
   * ColumnVisibilityChange is the columns selected in the dropdown
   * While triggering the dropdown we are updated the ColumnVisibilityChange with ColumnVisibility
   * Where ColumnVisibility is the columns selected after the changes are applied
   */
  const handleColumnDropdownChange = () => {
    setOpen(!open);
    setColumnVisibilityChanges({ ...columnVisibility });
    //If all checkboxes are checked or not and Based on that we have to update the select all
    const allChecked = Object.values({
      ...columnVisibility,
    }).every(Boolean);

    setSelectAll(allChecked);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-h-[50px] flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          {columnSelector && (
            <div>
              <DropdownMenu
                open={open}
                onOpenChange={handleColumnDropdownChange}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    className="flex h-10 w-[192px] flex-row justify-between rounded-xl hover:border hover:border-[1px] hover:border-solid hover:border-[#7677F4]"
                    id="base-table-column-selector-button"
                  >
                    {t("course.find_course:columns")}
                    <DropDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[192px] rounded-xl pl-3 pt-2.5"
                  align="start"
                >
                  <div>
                    <div className="scrollbar column-selector-responsive-container flex flex-col gap-4 overflow-y-auto text-[#333333]">
                      <div className="flex flex-row items-center gap-4">
                        <Checkbox
                          className="h-6 w-6 rounded-lg border-[1px] !border-[#D0D5DD]"
                          checked={selectAll}
                          onCheckedChange={handleSelectAllChange}
                          id="base-table-column-selector-select-all-checkbox"
                        />
                        <div className="text-[14px] font-bold">
                          {t("course.find_course:select_all")}
                        </div>
                      </div>
                      {table
                        .getAllColumns()
                        .filter((column) => column?.accessorFn)
                        // Here we are filtering the columns which have accessorKey
                        .map((column: any, id: number) => {
                          if (!column.getCanHide()) {
                            //display the disabled options
                            return (
                              <div
                                className="flex flex-row items-center gap-4"
                                key={column.id}
                              >
                                <Checkbox
                                  key={column.id}
                                  disabled={!column.getCanHide()}
                                  //Disabling the checkbox if the column cannot be hidden
                                  className="h-6 w-6 rounded-lg border-[1px] !border-[#D0D5DD]"
                                  checked={columnVisibilityChanges[column.id]}
                                  onCheckedChange={(value: boolean) => {
                                    handleColumnVisibilityChange(
                                      column.id,
                                      value
                                    );
                                  }}
                                  id={`column-${column?.columnDef?.column_name}`}
                                />
                                {column?.columnDef?.column_name}
                              </div>
                            );
                          }
                          return null;
                        })}
                      {table
                        .getAllColumns()
                        .filter(
                          (column) => column?.accessorFn && column.getCanHide()
                        )
                        // Here we are filtering the columns which have accessorKey
                        .map((column: any) => {
                          // display the enabled options
                          return (
                            <div key={column.id} className="flex flex-row items-center gap-4">
                              <Checkbox
                                key={column.id}
                                className="h-6 w-6 rounded-lg border-[1px] !border-[#D0D5DD]"
                                checked={columnVisibilityChanges[column.id]}
                                onCheckedChange={(value: boolean) => {
                                  handleColumnVisibilityChange(
                                    column.id,
                                    value
                                  );
                                }}
                              />
                              {column?.columnDef?.column_name}
                            </div>
                          );
                        })}
                    </div>

                    <div className="thin-scrollbar relative flex w-full flex-row items-center gap-4 overflow-auto pb-2.5 pt-2">
                      <div
                        onClick={clearColumnVisibilityChanges}
                        className="flex cursor-pointer flex-row items-center gap-2 text-sm font-semibold text-[#7677F4]"
                      >
                        <ClearAll />
                        <div
                          className="min-w-18 max-w-fit whitespace-nowrap hover:text-[#5E5FC3]"
                          id="base-table-column-selector-clear-all-button"
                        >
                          {t("clear_all")}
                        </div>
                      </div>
                      <Button
                        onClick={applyColumnVisibilityChanges}
                        className="min-w-18 h-9 max-w-fit rounded-xl hover:bg-[#5E5FC3]"
                        id="base-table-column-selector-apply-button"
                      >
                        {t("apply_button")}
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {/* column selector  */}

          {actionComponent && actionComponent}
        </div>
        {/* If pagination set true then we have to show pagination  */}
        <div>
          {pagination && total > pageSize && (
            <DataPagination
              setCurrent={setCurrent}
              current={current}
              pageCount={pageCount}
              total={total}
            />
          )}
        </div>
      </div>

      {/* Table */}
      <div>
        <div className="overflow-hidden rounded-xl border border-[1px]">
          <div
            ref={tableRef}
            className={`w-full ${tableStyles?.tableContainer} scrollbar relative overflow-auto`}
          >
            {isFiltering && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[white]/50 opacity-100">
                <div className="loader"></div>
              </div>
            )}
            <Table id={tableId} className={`${tableStyles?.table}`}>
              <TableHeader
                className={`w-full bg-[#7677F41B] ${tableStyles?.tableHeader}`}
              >
                {table &&
                  table?.getHeaderGroups()?.map((headerGroup) => (
                    <TableRow
                      className="w-full border-none text-[16px] font-bold"
                      key={headerGroup?.id}
                    >
                      {/* If the checkboxSelection is true then we need to show checkboxes  */}
                      {checkboxSelection && (
                        <TableHead
                          className={`${
                            columnPinning && "sticky left-0 bg-[#F1F1FE]"
                          }`}
                        >
                          <Checkbox
                            className="h-6 w-6 rounded-lg border-[1px] !border-[#D0D5DD]"
                            checked={table.getIsAllPageRowsSelected()}
                            onCheckedChange={(value: boolean) => {
                              table.toggleAllPageRowsSelected(value);
                            }}
                            aria-label="Select all"
                            id="base-table-select-all-checkbox"
                          />
                        </TableHead>
                      )}
                      {headerGroup?.headers?.map((header, index) => {
                        return (
                          <TableHead
                            //If we have column pinning true then we have to make the first and last column sticky
                            className={`${
                              columnPinning &&
                              index === 0 &&
                              `sticky ${
                                checkboxSelection ? "left-10" : "left-0"
                              } drop-shadow-right bg-[#F1F1FE]`
                            } ${
                              !noScroll &&
                              columnPinning &&
                              index === headerGroup.headers.length - 1 &&
                              `drop-shadow-left sticky right-0 w-[50px] bg-[#F1F1FE]`
                            } ${
                              tableStyles?.tableHeaderCell
                                ? tableStyles?.tableHeaderCell
                                : ""
                            } text-[#333333]`}
                            key={header?.id}
                          >
                            {header?.isPlaceholder
                              ? null
                              : flexRender(
                                  header?.column?.columnDef?.header,
                                  header?.getContext()
                                )}

                            {!noScroll &&
                              index === headerGroup.headers.length - 1 &&
                              columnPinning && (
                                <div className="flex flex-row gap-2">
                                  <ChevronLeft
                                    onClick={handlePrevButtonClick}
                                    className="mr-2 size-6 cursor-pointer rounded-full bg-[white] text-[#7677F4]"
                                    id="base-table-columns-left-button"
                                  />
                                  <ChevronRight
                                    onClick={handleNextButtonClick}
                                    className="size-6 cursor-pointer rounded-full bg-[#7677F4] text-[white]"
                                    id="base-table-columns-right-button"
                                  />
                                </div>
                              )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableHeader>
              <TableBody>
                {table && table?.getRowModel()?.rows?.length ? (
                  table?.getRowModel()?.rows?.map((row) => (
                    <TableRow
                      className={`{${tableStyles?.rowStyles}`}
                      key={row?.id}
                      // data-state={row?.getIsSelected() && "selected"}
                    >
                      {/* If the checkboxSelection is true then we need to show checkboxes  */}
                      {checkboxSelection && (
                        <TableCell
                          className={`${
                            columnPinning && "sticky left-0 bg-[#FFFFFF]"
                          }`}
                        >
                          <Checkbox
                            className="h-6 w-6 rounded-lg border-[1px] border-[#D0D5DD]"
                            checked={row?.getIsSelected()}
                            onCheckedChange={(value) =>
                              row?.toggleSelected(!!value)
                            }
                            aria-label="Select row"
                          />
                        </TableCell>
                      )}

                      {row?.getVisibleCells().map((cell, index) => (
                        //If we have column pinning true then we have to make the first and last column sticky
                        <TableCell
                          className={` ${
                            columnPinning &&
                            index === 0 &&
                            `sticky ${
                              checkboxSelection ? "left-10" : "left-0"
                            } drop-shadow-right top-0 bg-[#FFFFFF]`
                          } ${
                            !noScroll &&
                            columnPinning &&
                            index === row.getVisibleCells().length - 1 &&
                            `drop-shadow-left sticky right-0 top-0 w-[50px] bg-[#FFFFFF]`
                          } ${
                            tableStyles?.tableBodyCell
                              ? tableStyles?.tableBodyCell
                              : ""
                          } text-[#333333]`}
                          key={cell.id}
                        >
                          {flexRender(
                            cell?.column?.columnDef?.cell,
                            cell?.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns?.length}
                      className="h-24 text-left"
                    >
                      {noRecordsPlaceholder}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {pagination && total > pageSize && (
          <div className="mb-[24px] mt-[24px] flex justify-center">
            <DataPagination
              setCurrent={setCurrent}
              current={current}
              pageCount={pageCount}
              total={total}
              pageSize={pageSize}
            />
            {total >= 10 && (
              <div
                className="to absolute right-0 ml-auto mr-6 mt-3 flex flex-row items-center space-x-2 self-center"
                id="base-table-pagination-dropdown"
              >
                <Select
                  value={pageSize}
                  onValueChange={(value) => {
                    setCurrent(1);
                    setPageSize(Number(value));
                    table?.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger
                    className="h-8 w-[131px]"
                    id="base-table-page-size"
                  >
                    <div className="text-[#666666]">
                      {t("course.find_course:showing")}
                    </div>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {/* Updated pageSize options to include [10, 25, 50, 100]. */}
                    {[10, 25, 50, 100].map(
                      (
                        pageSize // Till now there is no limit will change after confirming TODO
                      ) => (
                        <SelectItem
                          key={pageSize}
                          value={`${pageSize}`}
                          id={`base-table-${pageSize}`}
                        >
                          {pageSize}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <div className="text-[14px] font-normal">
                  {t("course.find_course:of")} {total}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface DataPaginationProps {
  setCurrent?: (value: React.SetStateAction<number>) => void;
  current?: number;
  pageCount?: number;
  total?: number;
  pageSize?: number;
}

const DataPagination = ({
  setCurrent = () => {},
  total = 0,
  current = 1,
  pageCount = 1,
  pageSize = 0,
}: DataPaginationProps) => {
  const PagesArray = [];
  const DOTS = ". . .";
  if (pageCount <= 4) {
    // If there are 4 or fewer pages, show all pages without ellipses
    for (let i = 1; i <= pageCount; i++) {
      PagesArray.push(i);
    }
  } else {
    if (current <= 3) {
      // If current page is 4 or less, show pages 1 to 4, then ellipses, then last page
      PagesArray.push(1, 2, 3, 4, DOTS, pageCount);
    } else if (current >= pageCount - 2) {
      // If current page is near the end, show first page, ellipses, and last 4 pages
      PagesArray.push(
        1,
        DOTS,
        pageCount - 3,
        pageCount - 2,
        pageCount - 1,
        pageCount
      );
    } else {
      // Otherwise,first page , ellipses, current page, ellipses, and last page
      PagesArray.push(
        1,
        DOTS,
        current - 1,
        current,
        current + 1,
        DOTS,
        pageCount
      );
    }
  }

  const { t } = useTranslation(["common", "bx_v1"]);

  return (
    <div className="flex flex-row items-center space-x-2 self-center p-2 text-[13px]">
      {/* prev button */}
      {/* Check if there are more than one page, and if so, display a button for navigating to the previous page. */}
      {pageCount > 1 && (
        <Button
          variant="outline"
          className={`h-8 min-w-8 border-none p-0 text-[13px] !font-semibold ${
            current <= 1 ? "text-[#D6D7D8]" : " "
          }`}
          onClick={() => setCurrent(current - 1)}
          disabled={current <= 1}
          id="base-table-pagination-prev-button"
        >
          {t("bx_v1:cm_prev")}
        </Button>
      )}
      {/* pages buttons */}
      {total > pageSize &&
        PagesArray.map((page: any, index: any) => (
          <div key={index}>
            {/* Check if the current page is a placeholder for ellipsis.If yes, display the ellipsis.Otherwise, display a button for the page. */}
            {page === DOTS ? (
              <span className="p-2 text-[13px]">{DOTS}</span>
            ) : (
              <Button
                variant={page === current ? "default" : "outline"}
                onClick={() => {
                  setCurrent(page);
                }}
                className={`h-8 w-8 rounded-[8px] p-0 text-[13px] ${
                  page === current
                    ? "hover:bg-[#5E5FC3]"
                    : "hover:border-[1px] hover:border-solid hover:border-[#7677F4]"
                }`}
                id={`base-table-pagination-page-${page}-button`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      {/* next button */}
      {/* Check if there are more than one page, and if so, display a button for navigating to the next page. */}
      {pageCount > 1 && (
        <Button
          variant="outline"
          className={`h-8 min-w-8 border-none p-0 text-[13px] !font-semibold ${
            current >= pageCount ? "text-[#D6D7D8]" : " "
          }`}
          onClick={() => setCurrent(current + 1)}
          disabled={current >= pageCount}
          id="base-table-pagination-next-button"
        >
          {t("next")}
        </Button>
      )}
    </div>
  );
};