import { BaseTable } from "@components/course/findCourse/BaseTable";
import { getUtcOffset } from "@components/course/newCourse/NewCoursePreviewPage";
import Form from "@components/Formfield";
import CalenderIcon from "@public/assets/CalenderIcon";
import ClearAll from "@public/assets/ClearAll";
import CrossIcon from "@public/assets/CrossIcon";
import FilterIcon from "@public/assets/FilterIcon";
import SearchIcon from "@public/assets/Search";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { BaseOption, useGetIdentity, useList, useTable } from "@refinedev/core";
import { SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import dayjs from "dayjs";
import _ from "lodash";
import { useTranslation } from "next-i18next";
import { CountComponent, DateRangePickerComponent } from "pages/courses/list";
import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useController, useFormContext } from "react-hook-form";
import { SupabaseIdentity } from "src/authProvider";
import { TRANSFER_STATUS } from "src/constants/OptionLabels";
import { TransferFilterFormNames } from "src/constants/TransferParticipantFormNames";
import { Button } from "src/ui/button";
import { Checkbox } from "src/ui/checkbox";
import { Dialog, DialogContent } from "src/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/ui/dropdown-menu";
import { Input } from "src/ui/input";
import {
  MVPSelect,
  MVPSelectContent,
  MVPSelectItem,
  MVPSelectItems,
  MVPSelectTrigger,
} from "src/ui/SelectCommand";
import { Separator } from "src/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "src/ui/sheet";
import { Text } from "src/ui/TextTags";
import useExportTransferParticipantData from "src/utility/ExportTransferParticipantData";
import { getEnumsWithLabel } from "src/utility/GetOptionValuesByOptionLabel";
import { getTenantQuery } from "src/utility/GetTenantQuery";
import { setStaticDataFromDB } from "src/utility/staticData";
import { supabaseClient } from "src/utility/supabaseClient";
import useGetCountryCode from "src/utility/useGetCountryCode";
import useGetLanguageCode from "src/utility/useGetLanguageCode";
import {
  staticDataStore,
  StaticDataType,
} from "src/zustandStore/StaticDataStore";
import { TransferStore } from "src/zustandStore/TransferStore";
import {
  BulkTransferApproveDialog,
  BulkTransferRejectDialog,
  TransferRequestBulkApproveAlertPopUp,
  TransferRequestApprovePopUp,
  TransferRequestRejectAlertPopUp,
  TransferRequestRejectReasonPopUp,
  ViewTransferRequestApproveAlertPopUp,
} from "../TransferPopups";
import ViewTransferPopup from "../viewTransfer/ViewTransferPopup";
import TransferBulkAction from "./TransferBulkAction";
import TransferAllFilters from "./TransferListingAllFilters";
import { transferColumns } from "./TransferListingColumns";
import TransferParticipantExportAndCsv from "./TransferParticipantExport";

/**
 * transferParticipantList is a component that renders the transfer participant list
 * @returns {JSX.Element}
 */
const TransferParticipantList = () => {
  /**
   * languageCode is a hook that returns the language code
   * @returns {string}
   */
  const languageCode = useGetLanguageCode();

  var { t } = useTranslation([
    "common",
    "course.participants",
    "new_strings",
    "course.find_course",
    "course.view_course",
    "enum",
    "bx_v1",
    "bx_v2",
    "bx_v3",
    "bx_v5",
    "bx_v6",
    "bx_v7",
  ]);

  const {
    transferFiltersData,
    setTransferSelectedRowObjects,
    setOpenBulkTransferApproveDialog,
    setTransferBulkActionSelectedValue,
  } = TransferStore();

  // Getting static data from zustand variable and getting logged in user data from useGetIdentity<SupabaseIdentity>() hook
  const { staticData, setStaticData } = staticDataStore();

  const countryDefaultTimezone = staticData?.countryConfigData
    ?.localization_date_time_settings?.default_timezone as string;

  const { data: loggedInUserData } = useGetIdentity<SupabaseIdentity>();

  // const userPreferencesData = staticData?.userPreferencesData;

  const countryCode = useGetCountryCode();

  /**
   *This holds the all the filters when we select any filters
   */
  const filters: any = { permanent: getTenantQuery() };

  //If we search for particular course then we need to write a filter to the data query , here if it presents we will push to filters array
  if (transferFiltersData?.course_id) {
    filters.permanent.push({
      operator: "or",
      value: [
        {
          field: "from_program_code",
          operator: "ilike",
          value: `%${transferFiltersData?.course_id}%`,
        },
        {
          field: "to_program_code",
          operator: "ilike",
          value: `%${transferFiltersData?.course_id}%`,
        },
      ],
    });
  }

  //If we select date range for transfer courses then we have to write filter to fetch the transfer courses based on the range , we will push to filters
  if (transferFiltersData?.transfer_requested_date) {
    //Here the date picker uses the GMT time so , iam adding  1 day that is next day for from and to of course date
    filters.permanent?.push(
      {
        field: "created_at",
        operator: "gte",
        value:
          transferFiltersData?.transfer_requested_date.from &&
          new Date(
            new Date(
              transferFiltersData?.transfer_requested_date.from?.setUTCHours(
                0,
                0,
                0,
                0
              )
            ).getTime() +
              24 * 60 * 60 * 1000
          )
            .toISOString()
            .replace("T", " ")
            .slice(0, -5) + getUtcOffset(countryDefaultTimezone),
      },
      {
        field: "created_at",
        operator: "lte",
        value:
          transferFiltersData?.transfer_requested_date.to &&
          new Date(
            new Date(
              transferFiltersData?.transfer_requested_date.to?.setUTCHours(
                23,
                59,
                0,
                0
              )
            ).getTime() +
              24 * 60 * 60 * 1000
          )
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + getUtcOffset(countryDefaultTimezone),
      }
    );
  }

  //If we select course_status then we need to write a filter to the data query , here if it presents we will push to filters array
  if (transferFiltersData?.transfer_status) {
    filters.permanent.push({
      field: "transfer_status",
      operator: "eq",
      value: transferFiltersData?.transfer_status,
    });
  }

  //If we select organization then we need to write a filter to the data query , here if it presents we will push to filters array
  if (transferFiltersData?.advanceFilter?.organization?.length) {
    filters.permanent.push({
      field: "organization_id",
      operator: "in",
      value: transferFiltersData?.advanceFilter?.organization,
    });
  }

  //If we select participant_name then we need to write a filter to the data query , here if it presents we will push to filters array
  if (transferFiltersData?.advanceFilter?.participant_name?.length) {
    filters.permanent.push({
      field: "participant_name",
      operator: "ilike",
      value: `%${transferFiltersData?.advanceFilter?.participant_name}%`,
    });
  }

  //If we select requested_by then we need to write a filter to the data query , here if it presents we will push to filters array
  if (transferFiltersData?.advanceFilter?.requested_by) {
    filters.permanent.push({
      field: "raised_by_user_name",
      operator: "ilike",
      value: `%${transferFiltersData?.advanceFilter?.requested_by}%`,
    });
  }

  //If we select from_course_type then we need to write a filter to the data query , here if it presents we will push to filters array
  if (transferFiltersData?.advanceFilter?.from_course_type?.length) {
    filters.permanent.push({
      field: "from_course_type_id",
      operator: "in",
      value: transferFiltersData?.advanceFilter?.from_course_type,
    });
  }

  //If we select to_course_type then we need to write a filter to the data query , here if it presents we will push to filters array
  if (transferFiltersData?.advanceFilter?.to_course_type?.length) {
    filters.permanent.push({
      field: "to_course_type_id",
      operator: "in",
      value: transferFiltersData?.advanceFilter?.to_course_type,
    });
  }

  //If we select date range for transfer courses then we have to write filter to fetch the transfer courses based on the range , we will push to filters
  if (
    transferFiltersData?.advanceFilter?.from_course_start_date?.from ||
    transferFiltersData?.advanceFilter?.from_course_start_date?.to
  ) {
    //Here the date picker uses the GMT time so , iam adding  1 day that is next day for from and to of course date
    filters.permanent?.push(
      {
        field: "from_course_start_date",
        operator: "gte",
        value:
          transferFiltersData?.advanceFilter?.from_course_start_date.from &&
          new Date(
            new Date(
              transferFiltersData?.advanceFilter?.from_course_start_date.from?.setUTCHours(
                0,
                0,
                0,
                0
              )
            ).getTime() +
              24 * 60 * 60 * 1000
          )
            .toISOString()
            .replace("T", " ")
            .slice(0, -5) + getUtcOffset(countryDefaultTimezone),
      },
      {
        field: "from_course_start_date",
        operator: "lte",
        value:
          transferFiltersData?.advanceFilter?.from_course_start_date.to &&
          new Date(
            new Date(
              transferFiltersData?.advanceFilter?.from_course_start_date.to?.setUTCHours(
                23,
                59,
                0,
                0
              )
            ).getTime() +
              24 * 60 * 60 * 1000
          )
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + getUtcOffset(countryDefaultTimezone),
      }
    );
  }

  //If we select date range for transfer courses then we have to write filter to fetch the transfer courses based on the range , we will push to filters
  if (
    transferFiltersData?.advanceFilter?.to_course_start_date?.from ||
    transferFiltersData?.advanceFilter?.to_course_start_date?.to
  ) {
    //Here the date picker uses the GMT time so , iam adding  1 day that is next day for from and to of course date
    filters.permanent?.push(
      {
        field: "to_course_start_date",
        operator: "gte",
        value:
          transferFiltersData?.advanceFilter?.to_course_start_date.from &&
          new Date(
            new Date(
              transferFiltersData?.advanceFilter?.to_course_start_date.from?.setUTCHours(
                0,
                0,
                0,
                0
              )
            ).getTime() +
              24 * 60 * 60 * 1000
          )
            .toISOString()
            .replace("T", " ")
            .slice(0, -5) + getUtcOffset(countryDefaultTimezone),
      },
      {
        field: "to_course_start_date",
        operator: "lte",
        value:
          transferFiltersData?.advanceFilter?.to_course_start_date.to &&
          new Date(
            new Date(
              transferFiltersData?.advanceFilter?.to_course_start_date.to?.setUTCHours(
                23,
                59,
                0,
                0
              )
            ).getTime() +
              24 * 60 * 60 * 1000
          )
            ?.toISOString()
            .replace("T", " ")
            .slice(0, -5) + getUtcOffset(countryDefaultTimezone),
      }
    );
  }

  /**
   * sorting is an array of objects
   * each object has a id and desc property which are used to sort the data in the table
   */
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "id",
      desc: true,
    },
  ]);

  /**
   * fieldValue is a function that returns the field to be sorted
   * if sorting is empty, it will return "id"
   * @returns the field to be sorted in the table
   */
  const fieldValue = () => {
    if (!sorting.length) {
      setSorting([
        {
          id: "id",
          desc: true,
        },
      ]);
    }
    let field = sorting?.[0]?.id;
    if (field === "Status") field = "transfer_status";
    if (field === "from_course_name")
      field = `from_course_name->>${languageCode}`;
    if (field === "to_course_name") field = `to_course_name->>${languageCode}`;
    if (field === "from_course_id") field = "from_program_code";
    if (field === "to_course_id") field = "to_program_code";
    if (field === "request_by") field = "raised_by_user_name";
    if (field === "request_date") field = "created_at";
    if (field === "processed_date") field = "updated_at";
    return field;
  };

  const {
    tableQueryResult: transferParticipantData,
    pageCount,
    pageSize,
    setPageSize,
    current,
    setCurrent,
    setFilters,
  } = useTable({
    resource: "participant_reassignment_history_view",
    pagination: {
      pageSize: 25, //pageSize is set to 25
    },
    queryOptions: {
      keepPreviousData: true,
    },
    meta: {
      select:
        "*,from_course_type_id(name),to_course_type_id(name),from_program_id(id,is_residential_program,venue(*,city(name),state(name)),online_url),to_program_id(is_early_bird_enabled,id,status,program_accounting_status,org_product(is_online),is_residential_program,venue(*,city(name),state(name)),online_url,program_fee(*),program_accommodation(*)),from_participant_id(id,is_early_bird_used,program_fee_level_id(*),program_accommodation_id(name,accommodation_type_id)),to_participant_id",
    },
    filters: filters,
    sorters: {
      permanent: [
        {
          field: fieldValue(),
          order: sorting?.[0]?.desc ? "desc" : "asc",
        },
      ],
    },
  });

  /**
   * getColumns is a function that returns an array of columns
   * @returns array of columns
   */
  const getColumns = (): Array<any> => {
    // Retrieve the complete list of columns by invoking the `columns` function, passing the translation function `t` as a parameter.
    // The `columns` function returns an array of column definitions that are used in the table.
    const participantListingTableColumns: any = transferColumns(t, staticData);

    // Filter the retrieved columns based on visibility conditions.
    // The filter function iterates over each column in `listingColumns` and returns only those columns that meet the visibility criteria.
    return participantListingTableColumns?.filter((column: any) => {
      // Include the column in the final list if no filtering conditions are met.
      return true;
    });
  };

  console.log(transferParticipantData, "transferParticipantData");

  /**
   * transferParticipantsRowSelectionOnChange is a function that takes in a row selection and sets it to the rowSelection state variable.
   * @param row - row selection is an object that contains the ids of the selected rows.
   */
  const transferParticipantsRowSelectionOnChange = (row: any) => {
    const selectedRow = row();
    setRowSelection(row);
    if (Object.values(selectedRow).length === 0) {
      setAllSelected(false);
    }
  };

  /**
   * rowSelection is an object that contains the ids of the selected rows in the table.
   */
  const [rowSelection, setRowSelection] = React.useState({});

  /**
   * allSelected is a boolean that indicates whether all rows are selected in the table.
   */
  const [allSelected, setAllSelected] = useState<boolean>(false);

  /**
   * participantDataForSelectAll is an object that contains the ids of the selected rows in the table.
   */
  const participantDataForSelectAll = useList({
    resource: "participant_reassignment_history_view",
    meta: {
      select: "id",
    },
    hasPagination: false,
    filters: filters.permanent,
  });

  /**
   * rowCount is the number of selected rows in the table.
   */
  const rowCount = Object.values(rowSelection).filter(
    (value) => value === true
  ).length;

  /**
   * handleSelectAll is a function that takes in a boolean and sets it to the allSelected state variable.
   * @param val - val is a boolean that indicates whether all rows are selected in the table.
   * If the val is true, it sets allSelected to true, and if the val is false, it sets allSelected to false.
   */
  const handleSelectAll = (val: boolean) => {
    // If  we clicked the select all check box then we need to do the reverse of the present state,
    // And we are keeping the allSelected state variable in the checkbox of select all
    setAllSelected(!allSelected);
    // when the select all button is checked then we need to store all the data which is from the programDataForSelectAll constant and store in the row selection data
    if (!allSelected) {
      const allRowSelection: any = {};
      participantDataForSelectAll?.data?.data?.forEach((row: any) => {
        allRowSelection[row?.id] = val;
      });
      setRowSelection(allRowSelection);
    }
    // when is not checked then we need to remove the ids from the rowSelection
    else {
      setRowSelection([]);
    }
  };

  //whenever the filters data is changed then we need to set the filters using setFilters from use table hook
  //Because when we move to another route and comeback Filters are not setting properly that why we have written this
  useEffect(() => {
    setFilters(filters.permanent, "replace");
  }, [transferFiltersData]);

  useEffect(() => {
    setTransferSelectedRowObjects(rowSelection);
  }, [rowSelection]);

  const { data: userDataPreference } = useList({
    resource: "user_data_preference",
    filters: [
      {
        field: "tenant_id",
        operator: "eq",
        value: staticData?.tenantId,
      },
      {
        field: "user_id",
        operator: "eq",
        value: loggedInUserData?.id,
      },
    ],
  });

  const userPreferencesData: any = userDataPreference?.data;

  /**
   * This function is used to update the selected column preferences
   * @param userPreferences - The selected user preference columns by the current logged in user
   * Here a new record will be created in user_preferences table only if there is no record created previously for current logged in user
   * if there is a record created previously , then it will be updated with current column preferences selected by user
   * Then we will update the zustand variable and local storage with newly changed preferences data
   */
  const handleOnColumnsChange = async (userPreferences: any) => {
    try {
      // create a new object with the updated user preferences data
      const updatedStaticData: any = {
        user_id: loggedInUserData?.id,
        transfer_participant_table_column_list: userPreferences,
        tenant_id: staticData?.tenantId,
      };

      // upsert the user preference data in the supabase table
      const { error } = await supabaseClient()
        .from("user_data_preference")
        .upsert(updatedStaticData as any, { onConflict: "user_id" });

      if (error) {
        throw error;
      }

      // update the zustand variable with the new user preferences
      // setStaticData(updatedStaticData as StaticDataType);
      // // update the local storage with the new user preferences
      // setStaticDataFromDB(countryCode, updatedStaticData);
    } catch (error) {
      console.log(
        "error in creating or updating user preferences data in DB",
        error
      );
    }
  };

  return (
    <div className="relative flex flex-col justify-between">
      {/*This just to Access the export table in the DOM by getElementById */}
      <div>
        <TransferParticipantExportAndCsv />
      </div>
      <p className="ml-8 text-2xl font-semibold">
        {t("bx_v2:cpm_participants_transfer")}
      </p>
      <div className="mx-8 mt-4 flex flex-col bg-[white]">
        <HeaderSection setCurrent={setCurrent} />

        {transferParticipantData.isLoading ? (
          <section className="align-center flex justify-center py-[10%]">
            <div className="loader"></div>
          </section>
        ) : (
          <div className="mb-[50px] w-full">
            <BaseTable
              current={current}
              rowSelection={rowSelection}
              setRowSelection={transferParticipantsRowSelectionOnChange}
              checkboxSelection={true}
              setCurrent={setCurrent}
              pageCount={pageCount}
              total={transferParticipantData?.data?.total ?? 0}
              pageSize={pageSize}
              setPageSize={setPageSize}
              sorting={sorting}
              setSorting={setSorting}
              pagination={true}
              tableStyles={{
                table: "",
                rowStyles: "!important border-none",
                tableHeaderCell: "p-3",
                tableBodyCell: "p-3",
              }}
              columns={getColumns()}
              data={transferParticipantData?.data?.data || []}
              columnPinning={true}
              columnSelector={true}
              noRecordsPlaceholder={t(
                "bx_v2:cpm_participants_there_are_no_participants"
              )}
              userColumnPreferences={
                userPreferencesData?.[0]
                  ?.transfer_participant_table_column_list as unknown as any
              }
              handleUserColumnPreferences={handleOnColumnsChange}
              actionComponent={<TransferBulkAction />}
            />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 m-0 flex h-[52px] w-full flex-row items-center justify-between bg-[white] px-8 py-1 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              checked={allSelected}
              onCheckedChange={handleSelectAll}
              className="h-6 w-6 rounded-lg border-[1px] border-[#D0D5DD]"
              id="participant-listing-select-all"
            />
            <div>{t("course.find_course:select_all")}</div>
            <div className="font-semibold">
              {transferParticipantData?.data?.total || 0}
            </div>
          </div>
          <div>|</div>
          <div className="flex flex-row gap-2">
            {t("course.find_course:selected")}{" "}
            {allSelected ? transferParticipantData?.data?.total : rowCount}{" "}
            {t("course.find_course:out_of")}{" "}
            <div className="font-semibold">
              {transferParticipantData?.data?.total || 0}
            </div>{" "}
          </div>
        </div>
        <div>
          <TransferParticipantExportDropdown />
        </div>
      </div>
      <ViewTransferPopup />
      <TransferRequestRejectAlertPopUp />
      <TransferRequestRejectReasonPopUp />
      <ViewTransferRequestApproveAlertPopUp />
      <TransferRequestApprovePopUp />
      <BulkTransferApproveDialog setRowSelection={setRowSelection} />
      <TransferRequestBulkApproveAlertPopUp
        handleApprove={() => setOpenBulkTransferApproveDialog(true)}
        handleReject={() => {
          setTransferBulkActionSelectedValue("");
        }}
      />
      <BulkTransferRejectDialog setRowSelection={setRowSelection} />
    </div>
  );
};

export default TransferParticipantList;

const HeaderSection: React.FC<{
  setCurrent: (number: number) => void;
}> = ({ setCurrent }) => {
  const { transferFiltersData } = TransferStore();

  return (
    <Form onSubmit={() => {}} defaultValues={transferFiltersData}>
      <div className="mb-[24px] flex w-full flex-row items-center justify-between gap-x-[2%] rounded-3xl bg-[#FFFFFF] px-8 py-4 shadow-md">
        {/* All Filters */}
        <div className="flex-[0.25]">
          <AdvanceFilter setCurrent={setCurrent} />
        </div>

        {/* Basic Filters */}
        <div className="flex-[1.75]">
          {/* whenever we apply filters we will be navigated to page 1 by using setCurrent prop */}
          <BasicFilters setCurrent={setCurrent} />
        </div>
      </div>
    </Form>
  );
};

const BasicFilters: React.FC<{
  setCurrent: (number: number) => void;
}> = ({ setCurrent }) => {
  const { t } = useTranslation(["common", "course.find_course", "bx_v1"]);

  const { setTransferFiltersData, setAdvanceFilterCount } = TransferStore();

  const { watch, setValue } = useFormContext();
  const formData = watch();

  // Controls the visibility of a popup modal, with `false` indicating it's closed
  const [open, setOpen] = useState(false);

  const {
    field: { value, onChange },
  } = useController({
    name: TransferFilterFormNames?.course_id,
  });

  const {
    field: { value: transferDate, onChange: transferDateOnChange },
  } = useController({
    name: TransferFilterFormNames?.transfer_requested_date,
  });

  // Prevent the default action when pressing the "Enter" key in any input field
  const handleKeyPress = (e: { key: string; preventDefault: () => void }) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Clear all filters when clicking the "Clear All" button, resetting specific fields to empty values
  const handleClearAll = () => {
    setValue(TransferFilterFormNames?.course_id, "");
    setValue(TransferFilterFormNames?.transfer_requested_date, "");
    setValue(TransferFilterFormNames?.transfer_status, "");
    setAdvanceFilterCount(0);
    setValue("tempFilters.organization", []);
    setValue("tempFilters.participant_name", "");
    setValue("tempFilters.to_course_type", []);
    setValue("tempFilters.from_course_type", []);
    setValue("tempFilters.from_course_start_date", "");
    setValue("tempFilters.to_course_start_date", "");
    setValue("tempFilters.requested_by", "");
    setValue("advanceFilter", "");
    setTransferFiltersData({}); //when clicked on clear button all the data will be reset
  };

  // Apply the selected filters when clicking the "Apply" button
  const handleApply = () => {
    setTransferFiltersData(formData);
    //whenever we apply filters we will be navigated to page 1
    setCurrent(1);
  };

  // Handle input change by allowing only alphanumeric characters and converting them to uppercase
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Allow only alphanumeric characters and convert to uppercase
    inputValue = inputValue.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    onChange(inputValue);
  };

  return (
    <div className="flex flex-row items-center justify-between gap-x-[2%]">
      {/* Search by Course ID */}
      <div className="flex w-[50%] min-w-48 flex-row items-center justify-center rounded-xl border border-[1px] px-2 hover:border hover:border-[1px] hover:border-solid hover:border-[#7677F4]">
        <SearchIcon />
        <Input
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          type="text"
          className="border-none focus:outline-none"
          placeholder={t("course.find_course:search_by_course_id")}
          id="findTransfer-course-id-search-input"
        />
      </div>

      {/* Select the Transfer request Date Range */}
      <>
        {" "}
        <Dialog open={open} onOpenChange={setOpen}>
          <Button
            className="flex h-[40px] w-[50%] flex-row items-center justify-start gap-2 rounded-xl hover:border hover:border-[1px] hover:border-solid hover:border-[#7677F4]"
            variant="outline"
            onClick={() => {
              setOpen(true);
            }}
            id="findTransfer-date-range-picker"
          >
            <div>
              <CalenderIcon color="#666666" />
            </div>
            {/* here if there is transferDate.from then only we need to format other wise we can show placeholder */}
            {transferDate && transferDate.from ? (
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex flex-row gap-2 text-[14px]">
                  {/* If the course from date and to date is present then only format and show the from date and to date */}
                  <Text className="font-semibold">
                    {transferDate.from &&
                      format(transferDate.from, "MM/dd/yyyy")}
                  </Text>{" "}
                  {transferDate.to && <span>-</span>}{" "}
                  <Text className="font-semibold">
                    {transferDate.to && format(transferDate.to, "MM/dd/yyyy")}
                  </Text>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    //when we click on cross icon we need to clear the date
                    transferDateOnChange(undefined);
                  }}
                  id="cross-icon"
                  className="ml-auto"
                >
                  <CrossIcon fill="#7677F4" height={10} width={10} />
                </div>
              </div>
            ) : (
              <div className="flex gap-2 font-normal text-[#999999]">
                {t("bx_v1:cm_select_the_date_range")}
              </div>
            )}
          </Button>
          <DialogContent
            closeIcon={true}
            className="!w-[850px] !rounded-3xl bg-[#FFFFFF]"
          >
            <DateRangePickerComponent
              setOpen={setOpen}
              value={transferDate}
              onSelect={transferDateOnChange}
            />
          </DialogContent>
        </Dialog>
      </>

      {/* Transfer Status */}
      <div
        className="w-[50%] min-w-[150px]"
        id="findTransfer-transfer-status-dropdown"
      >
        <TransferStatusComponent />
      </div>

      {/* Clear All and Apply buttons in Overall filter */}
      <div className="flex w-[50%] flex-row items-center justify-end gap-x-[8px]">
        {/* Clear All */}
        <div
          onClick={handleClearAll}
          className="flex min-w-[90px] cursor-pointer flex-row items-center gap-2 text-sm font-semibold text-[#7677F4]"
          id="findTransfer-clear-all-button"
        >
          <ClearAll />
          <div className="hover:text-[#5E5FC3]">{t("clear_all")}</div>
        </div>

        {/* Apply */}
        <Button
          onClick={handleApply}
          className="w-18 h-9 rounded-xl hover:bg-[#5E5FC3]"
          id="findTransfer-apply-button"
        >
          {t("apply_button")}
        </Button>
      </div>
    </div>
  );
};

const TransferStatusComponent = () => {
  const { t } = useTranslation(["bx_v7"]);
  const participantTransferStatus = getEnumsWithLabel({
    label: TRANSFER_STATUS,
  });

  const {
    field: { value, onChange },
  } = useController({
    name: TransferFilterFormNames?.transfer_status,
  });

  const transferStatusDefaultOption = participantTransferStatus?.filter(
    (option) => option?.value == value
  );

  return (
    <MVPSelect
      defaultOptions={transferStatusDefaultOption}
      value={value}
      onChange={(val: string) => {
        onChange(val?.toUpperCase());
      }}
    >
      <MVPSelectTrigger
        placeholder={t("bx_v7:cpt_transfer_status")}
        className="w-full rounded-[12px] border-[1px] hover:border hover:border-[1px] hover:border-solid hover:border-[#7677F4]"
      />
      <MVPSelectContent>
        <MVPSelectItems>
          {participantTransferStatus?.map((item: BaseOption, index: number) => {
            return (
              <>
                <MVPSelectItem
                  value={item?.value}
                  key={index}
                  label={item?.label}
                >
                  {item?.label}
                </MVPSelectItem>
              </>
            );
          })}
        </MVPSelectItems>
      </MVPSelectContent>
    </MVPSelect>
  );
};

/**
 * @component TransferParticipantExportDropdown
 * @description This component renders a dropdown menu with three options:
 * 1. Export to excel
 * 2. Export to csv
 * 3. Export to pdf
 * It also displays the number of selected rows and disables the dropdown if there are no selected rows.
 */
const TransferParticipantExportDropdown = () => {
  const { t } = useTranslation([
    "course.find_course",
    "bx_v2",
    "bx_v1",
    "bx_v6",
    "enum",
  ]);

  const { transferSelectedRowObjects } = TransferStore();

  const languageCode = useGetLanguageCode();

  const { staticData } = staticDataStore();

  const countryDefaultTimezone = staticData?.countryConfigData
    ?.localization_date_time_settings?.default_timezone as string;

  const [transferExportLoading, setIsTransferExportLoading] = useState(false);

  const [ExcellentExport, setExcellentExport] = useState<any>(null);

  const { getTransferParticipantData } = useExportTransferParticipantData();

  const rowCount = Object.keys(transferSelectedRowObjects)?.length;

  const timeStamp = dayjs(new Date())?.format("YYMMDD_HHmm");

  const tableRef = useRef<HTMLTableElement>(null);

  /**
   * Columns for the pdf export
   */
  const transferPdfColumns = [
    {
      column_name: t("bx_v6:cpm_transfer_participant_name"),
      header: () => {
        return <div>{t("bx_v6:cpm_transfer_participant_name")}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div className="w-[180px] break-all">
            {row?.original?.participant_name
              ? row?.original?.participant_name
              : ""}
          </div>
        );
      },
    },
    {
      column_name: t("bx_v6:cpm_transfer_status"),
      header: () => {
        return <div>{t("bx_v6:cpm_transfer_status")}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div>
            {row?.original?.transfer_status
              ? t(`enum:${row?.original?.transfer_status}`)
              : ""}
          </div>
        );
      },
    },
    {
      column_name: t("bx_v6:cpm_transfer_from_course_name"),
      header: () => {
        return <div>{t("bx_v6:cpm_transfer_from_course_name")}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div>
            {row?.original?.from_course_name
              ? _.get(row?.original?.from_course_name, languageCode)
              : ""}
          </div>
        );
      },
    },
    {
      column_name: t("bx_v6:cpm_transfer_to_course_name"),
      header: () => {
        return <div>{t("bx_v6:cpm_transfer_to_course_name")}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div>
            {row?.original?.to_course_name
              ? _.get(row?.original?.to_course_name, languageCode)
              : ""}
          </div>
        );
      },
    },
    {
      column_name: t("bx_v6:cpm_transfer_from_course_id"),
      header: () => {
        return <div>{t("bx_v6:cpm_transfer_from_course_id")}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div>
            {row?.original?.from_program_code
              ? row?.original?.from_program_code
              : ""}
          </div>
        );
      },
    },
    {
      column_name: t("bx_v6:cpm_transfer_to_course_id"),
      header: () => {
        return <div>{t("bx_v6:cpm_transfer_to_course_id")}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div>
            {row?.original?.to_program_code
              ? row?.original?.to_program_code
              : ""}
          </div>
        );
      },
    },
    {
      column_name: t("bx_v6:cpm_transfer_requested_by"),
      header: () => {
        return <div>{t("bx_v6:cpm_transfer_requested_by")}</div>;
      },
      cell: ({ row }: any) => {
        return (
          <div className="w-[180px] break-all">
            {row?.original?.raised_by_user_name
              ? row?.original?.raised_by_user_name
              : ""}
          </div>
        );
      },
    },
    {
      column_name: t("bx_v6:cpm_transfer_requested_date"),
      header: () => {
        return <div>{t("bx_v6:cpm_transfer_requested_date")}</div>;
      },
      cell: ({ row }: any) => {
        const requestDate = row?.original?.created_at
          ? dayjs(row?.original?.created_at)
              .tz(countryDefaultTimezone)
              .format("DD MMM, YYYY")
          : "";

        return <div>{requestDate}</div>;
      },
    },
    {
      column_name: t("bx_v6:cpm_transfer_processed_date"),
      header: () => {
        return <div>{t("bx_v6:cpm_transfer_processed_date")}</div>;
      },
      cell: ({ row }: any) => {
        const updatedDate = row?.original?.updated_at
          ? dayjs(row?.original?.updated_at)
              .tz(countryDefaultTimezone)
              .format("DD MMM, YYYY")
          : "";

        return <div>{updatedDate}</div>;
      },
    },
  ];

  /**
   * This `useEffect` hook loads the `excellentexport` module dynamically when the component mounts,
   * but only if the code is running in the browser (i.e., `window` is defined).
   *
   * The module is imported using dynamic `import()` syntax, which allows for code splitting
   * and loading the module only when it's needed, thus optimizing performance.
   *
   * Once the module is successfully loaded, it is stored in the component's state using `setExcellentExport`.
   * If there is an error during the import process, it is caught and logged to the console.
   *
   * This hook runs only once when the component mounts due to the empty dependency array `[]`.
   *
   * @see https://reactjs.org/docs/hooks-effect.html
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("excellentexport")
        .then((module) => {
          setExcellentExport(module); // Store the loaded module in state
        })
        .catch((error) => {
          console.error("Error loading ExcellentExport:", error);
        });
    }
  }, []);

  /**
   * Asynchronously exports participant data to an Excel file.
   *
   * This function performs the following steps:
   * 1. Starts a loading indicator to show that the export process has begun.
   * 2. Filters and collects selected participant IDs based on the `transferSelectedRowObjects`.
   * 3. Fetches participant data using the `getTransferParticipantData` function.
   * 4. Checks if the code is running in the browser and if `ExcellentExport` is available.
   * 5. Retrieves the HTML table element with the ID `transferParticipantExportTable`.
   * 6. Creates a temporary link element to facilitate the Excel file download.
   * 7. Uses the `ExcellentExport` library to generate the Excel file from the table data.
   * 8. Sets the filename for the Excel file and triggers the download by simulating a click on the link.
   * 9. Cleans up by removing the link element from the DOM.
   * 10. Stops the loading indicator after the download starts.
   *
   * If any issues occur during the process (e.g., missing table element or unavailable `ExcellentExport`),
   * they are logged to the console, and the loading indicator is stopped.
   *
   * @async
   * @function
   * @returns {Promise<void>} - A promise that resolves when the export process is complete.
   * @throws {Error} Throws an error if there is an issue with the table element or the `ExcellentExport` library.
   */
  const exportToExcel = async () => {
    setIsTransferExportLoading(true);
    const selectedIds: number[] = Object.keys(transferSelectedRowObjects)
      .filter((key: any) => transferSelectedRowObjects[key] === true)
      .map(Number);

    await getTransferParticipantData(selectedIds);

    try {
      if (typeof window !== "undefined" && ExcellentExport) {
        const table = document.getElementById(
          "transferParticipantExportTable"
        ) as HTMLTableElement | null;

        if (table) {
          const link = document.createElement("a");
          link.id = "transferParticipantExcelLink";

          // Generate the Excel file using ExcellentExport
          ExcellentExport.excel(link, table, "Sheet1");

          const fileName = `${t("bx_v6:transfer_details")}_${timeStamp}.xls`;

          // Set the download attribute and file name
          link.setAttribute("download", fileName);

          // Append link to the DOM temporarily
          document.body.appendChild(link);

          // Trigger the download
          link.click();

          // Remove the link after clicking
          document.body.removeChild(link);
        } else {
          console.error("Table element not found.");
          throw new Error("Table element for export not found.");
        }
      } else {
        console.error("ExcellentExport is not available or undefined.");
        throw new Error("ExcellentExport is not available.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsTransferExportLoading(false);
    }
  };

  /**
   * Export the selected transfer participant data to a CSV file.
   *
   * This function performs the following steps:
   * 1. Starts a loading indicator to show that the export process has begun.
   * 2. Collects the selected participant IDs from the `selectedRowObjects` based on the selected status.
   * 3. Fetches the participant data using the `getTransferParticipantData` function.
   * 4. Checks if the code is running in the browser and if the `ExcellentExport` library is available.
   * 5. Retrieves the HTML table element with the ID `transferParticipantExportTable`.
   * 6. Creates a temporary link element to facilitate the CSV file download.
   * 7. Uses the `ExcellentExport` library to generate the CSV file from the table data.
   * 8. Sets the filename for the CSV file and triggers the download by simulating a click on the link.
   * 9. Cleans up by removing the link element from the DOM.
   * 10. Stops the loading indicator after the download starts.
   *
   * If any errors occur during the process (e.g., missing table element or unavailable `ExcellentExport`),
   * they are logged to the console, and the loading indicator is stopped.
   *
   * @async
   * @function
   * @returns {Promise<void>} - A promise that resolves when the export process is complete.
   */
  const exportToCSV = async () => {
    setIsTransferExportLoading(true);

    const selectedIds: number[] = Object.keys(transferSelectedRowObjects)
      .filter((key: any) => transferSelectedRowObjects[key] === true)
      .map(Number);

    await getTransferParticipantData(selectedIds);

    try {
      if (typeof window !== "undefined" && ExcellentExport) {
        const table = document.getElementById(
          "transferParticipantExportTable"
        ) as HTMLTableElement | null;

        if (table) {
          const link = document.createElement("a");
          link.id = "transferParticipantCSVLink";

          const fileName = `${t("bx_v6:transfer_details")}_${timeStamp}.csv`;

          // Generate CSV using ExcellentExport
          ExcellentExport.csv(link, table);
          // Set the download attribute and file name
          link.setAttribute("download", fileName);
          // Append link to the DOM temporarily
          document.body.appendChild(link);
          // Programmatically trigger the click event to download the file
          link.click();
          // Remove the link after clicking
          document.body.removeChild(link);
        } else {
          console.error("Table element not found.");
        }
      } else {
        console.error("ExcellentExport is not available or undefined.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTransferExportLoading(false);
    }
  };

  /**
   * Export the selected transfer participant data to a PDF file.
   *
   * This function performs the following steps:
   * 1. Starts a loading indicator to show that the export process has begun.
   * 2. Collects the selected participant IDs from the `selectedRowObjects` based on the selected status.
   * 3. Iterates through the selected IDs and creates a new array of processed data, where each row is an array of processed cells.
   * 4. Creates a new table element in the DOM, and appends a `thead` element with headers, and a `tbody` element with the processed data.
   * 5. Uses the `html2pdf.js` library to generate a PDF file based on the table element.
   * 6. Sets the filename for the PDF file and triggers the download by simulating a click on the link.
   * 7. Cleans up by removing the link element from the DOM.
   * 8. Stops the loading indicator after the download starts.
   *
   * If any errors occur during the process (e.g., missing table element or unavailable `ExcellentExport`),
   * they are logged to the console, and the loading indicator is stopped.
   *
   * @async
   * @function
   * @returns {Promise<void>} - A promise that resolves when the export process is complete.
   */
  const exportToPdf = async () => {
    setIsTransferExportLoading(true);

    const selectedIds: number[] = Object.keys(transferSelectedRowObjects)
      .filter((key: any) => transferSelectedRowObjects[key] === true)
      .map(Number);

    const data = await getTransferParticipantData(selectedIds);

    const pdfFileName = `${t("bx_v6:transfer_details")}_${timeStamp}.pdf`;

    const tableElement = tableRef.current;

    if (!tableElement) {
      return;
    }

    const processedData: any = [];
    // Iterate through the selected IDs and create a new array of processed data
    selectedIds?.map((id) => {
      const row = data?.find((item: any) => item?.id === id);

      const processedRow = transferPdfColumns?.map((column: any) => {
        // Create a mock row to pass to the cell renderer
        const mockRow = { original: row };
        // Render the cell element to HTML
        const cellElement = column?.cell?.({ row: mockRow });
        // Use ReactDOMServer to render the cell element to static HTML
        const cellHtml = ReactDOMServer.renderToStaticMarkup(cellElement);

        return cellHtml;
      });

      processedData?.push(processedRow);
    });

    // Create a new div element to hold the heading and table
    const container = document.createElement("div");

    // Create a heading element
    const heading = document.createElement("h2");
    heading.style.textAlign = "center"; // Center the heading
    heading.style.fontSize = "24px"; // Font size 24
    heading.style.fontWeight = "bold"; // Bold font
    heading.style.marginBottom = "25px"; // Add some margin below the heading
    heading.innerHTML = `${t("bx_v6:transfer_pdf_heading")}`; // Set the heading text

    // Append the heading to the container
    container.appendChild(heading);

    // Create a new table element in the DOM
    const newTable = document.createElement("table");
    newTable.style.width = "100%";
    newTable.style.borderCollapse = "collapse";

    // Add the thead element with headers
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    transferPdfColumns?.forEach((column: any) => {
      // Render the header element to HTML
      const headerElement = column?.header?.();
      const headerHtml = ReactDOMServer.renderToStaticMarkup(headerElement);
      const th = document.createElement("th");
      th.style.border = "1px solid black";
      th.style.padding = "5px";
      th.innerHTML = headerHtml;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    newTable.appendChild(thead);

    // Add the tbody element with the processed data
    const tbody = document.createElement("tbody");

    processedData?.forEach((row: any) => {
      const newRow = document.createElement("tr");

      // Prevent the row from being split across pages
      newRow.style.pageBreakInside = "avoid";

      row?.forEach((cellData: any) => {
        const cell = document.createElement("td");
        cell.style.border = "1px solid black";
        cell.style.padding = "5px";
        cell.innerHTML = cellData;
        newRow.appendChild(cell);
      });

      tbody.appendChild(newRow);
    });

    newTable.appendChild(tbody);

    // Append the table to the container
    container.appendChild(newTable);

    // Use html2pdf.js to generate a PDF file based on the container element
    const html2pdfModule = (await import("html2pdf.js/dist/html2pdf.min.js"))
      .default;
    html2pdfModule()
      .set({
        margin: 0.1,
        filename: pdfFileName,
        html2canvas: { scale: 2 },
        jsPDF: {
          orientation: "landscape",
          unit: "in",
          format: "letter",
          compressPDF: true,
        },
        pagebreak: {
          avoid: "tr", // Avoid breaking table rows
          mode: ["avoid-all", "css"], // Ensure CSS rules like 'page-break-inside' are respected
        },
      })
      .from(container) // Use the container element that contains the heading and table
      .save();

    setIsTransferExportLoading(false);
  };

  return (
    <div>
      <table ref={tableRef} id="transferParticipantExportTable"></table>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={rowCount <= 0}>
          <Button
            variant="outline"
            className="flex flex-row gap-2 rounded-xl border border-[#7677F4] text-sm font-bold text-[#7677F4]"
            id="transfer-participant-export-dropdown"
          >
            {transferExportLoading ? (
              <div className="loader !w-[25px]"></div>
            ) : (
              t("course.find_course:export")
            )}
            <ChevronDownIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full font-sans font-medium focus:outline-none">
          {/* Export to excel  */}
          <DropdownMenuItem
            onClick={() => {
              exportToExcel();
            }}
            className="cursor-pointer p-1 focus:outline-none"
            id="transfer-participant-export-excel"
          >
            {t("bx_v2:cpm_participants_excel")}
          </DropdownMenuItem>

          {/* Export to csv  */}
          <DropdownMenuItem
            onClick={() => {
              exportToCSV();
            }}
            className="cursor-pointer p-1 focus:outline-none"
            id="transfer-participant-export-csv"
          >
            {t("bx_v1:cm_csv")}
          </DropdownMenuItem>

          {/* Export to pdf */}
          <DropdownMenuItem
            onClick={() => {
              exportToPdf();
            }}
            className="cursor-pointer p-1 focus:outline-none"
            id="transfer-participant-export-pdf"
          >
            {t("bx_v2:cpm_participants_pdf")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

/**
 * The AdvanceFilter component.
 * @returns The AdvanceFilter component.
 */
const AdvanceFilter = ({ setCurrent }: { setCurrent: Function }) => {
  const {
    transferAdvanceFilterOpen,
    setTransferAdvanceFilterOpen,
    advanceFilterCount,
  } = TransferStore();

  const { t } = useTranslation("course.find_course");
  const { watch, setValue } = useFormContext();
  const formData = watch();
  return (
    <Sheet
      open={transferAdvanceFilterOpen}
      onOpenChange={setTransferAdvanceFilterOpen}
    >
      <SheetTrigger className="p-0">
        <Button
          onClick={() => {
            setTransferAdvanceFilterOpen(true);
            const advanceFilterValues = { ...formData };
            setValue("tempFilters", advanceFilterValues.advanceFilter);
          }}
          className="flex min-w-[184px] flex-row justify-between !rounded-xl px-4 hover:border-[1px] hover:border-solid hover:border-[#7677F4]"
          variant="outline"
        >
          <div className="flex flex-row gap-2">
            <FilterIcon />
            {t("course.find_course:all_filters")}
          </div>

          {advanceFilterCount > 0 && (
            <CountComponent count={advanceFilterCount} />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[446px] rounded-l-[24px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <SheetHeader className="flex h-[3vh]">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-semibold">
              {t("course.find_course:filter_by")}
            </p>
            <div
              onClick={() => {
                // setCount(filterCount);
                setTransferAdvanceFilterOpen(false);
              }}
              className="cursor-pointer"
            >
              <div className="cursor-pointer">
                <CrossIcon width={16} height={16} fill="#333333" />
              </div>
            </div>
          </div>
          <Separator className="!mt-5" />
        </SheetHeader>
        <TransferAllFilters setCurrent={setCurrent} />
      </SheetContent>
    </Sheet>
  );
};
