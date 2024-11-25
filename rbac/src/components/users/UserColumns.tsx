// Import necessary modules and components
import { ColumnDef } from "@tanstack/react-table";
import { TableHeader } from "../ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreVertical } from "lucide-react";
import { supabase } from "../../utility/SupabaseClient";

// Define a type for extended column definition
type ExtendedColumnDef<T> = ColumnDef<T> & { column_name?: string };

/**
 * Function to define transfer columns for the table
 *
 * @param {Object} t - translation object, staticData
 * @returns {Array} - array of column definitions
 */
export const transferColumns = () => {
    const columns: ExtendedColumnDef<any>[] = [
        {
            /**
             * Participant name column
             */
            accessorKey: "participant_name",
            column_name: "bx_v6:cpm_transfer_participant_name",
            enablePinning: true,
            enableHiding: false,
            header: () => (
                <TableHeader className="min-w-[150px] text-left text-sm font-semibold">
                    email
                </TableHeader>
            ),
            cell: ({ row }: any) => (

                <div className="flex min-w-[150px] items-center gap-2 text-left font-semibold capitalize">
                    {row?.original?.email ? (
                        <abbr
                            title={row?.original?.participant_name}
                            className="line-clamp-2 break-all no-underline"
                        >
                            {row?.original?.email}
                        </abbr>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
        {
            /**
             * Participant name column
             */
            accessorKey: "participant_name",
            column_name: "bx_v6:cpm_transfer_participant_name",
            enablePinning: true,
            enableHiding: false,
            header: () => (
                <TableHeader className="min-w-[150px] text-left text-sm font-semibold">
                    email
                </TableHeader>
            ),
            cell: ({ row }: any) => (

                <div className="flex min-w-[150px] items-center gap-2 text-left font-semibold capitalize">
                    {row?.original?.email ? (
                        <abbr
                            title={row?.original?.participant_name}
                            className="line-clamp-2 break-all no-underline"
                        >
                            {row?.original?.email}
                        </abbr>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
        {
            /**
             * Participant name column
             */
            accessorKey: "participant_name",
            column_name: "bx_v6:cpm_transfer_participant_name",
            enablePinning: true,
            enableHiding: false,
            header: () => (
                <TableHeader className="min-w-[150px] text-left text-sm font-semibold">
                    email
                </TableHeader>
            ),
            cell: ({ row }: any) => (

                <div className="flex min-w-[150px] items-center gap-2 text-left font-semibold capitalize">
                    {row?.original?.email ? (
                        <abbr
                            title={row?.original?.participant_name}
                            className="line-clamp-2 break-all no-underline"
                        >
                            {row?.original?.email}
                        </abbr>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
        {
            /**
             * Participant name column
             */
            accessorKey: "participant_name",
            column_name: "bx_v6:cpm_transfer_participant_name",
            enablePinning: true,
            enableHiding: false,
            header: () => (
                <TableHeader className="min-w-[150px] text-left text-sm font-semibold">
                    email
                </TableHeader>
            ),
            cell: ({ row }: any) => (

                <div className="flex min-w-[150px] items-center gap-2 text-left font-semibold capitalize">
                    {row?.original?.email ? (
                        <abbr
                            title={row?.original?.participant_name}
                            className="line-clamp-2 break-all no-underline"
                        >
                            {row?.original?.email}
                        </abbr>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
        {
            /**
             * Participant name column
             */
            accessorKey: "participant_name",
            column_name: "bx_v6:cpm_transfer_participant_name",
            enablePinning: true,
            enableHiding: false,
            header: () => (
                <TableHeader className="min-w-[150px] text-left text-sm font-semibold">
                    email
                </TableHeader>
            ),
            cell: ({ row }: any) => (

                <div className="flex min-w-[150px] items-center gap-2 text-left font-semibold capitalize">
                    {row?.original?.email ? (
                        <abbr
                            title={row?.original?.participant_name}
                            className="line-clamp-2 break-all no-underline"
                        >
                            {row?.original?.email}
                        </abbr>
                    ) : (
                        "-"
                    )}
                </div>
            ),
        },
        {
            /**
             * Actions column
             */
            id: "actions",
            enableHiding: false,
            cell: ({ row }: any) => {
                return (
                    <div className="flex justify-center">
                       <UserActions participantId={row?.original?.id} />

                    </div>
                );
            },
        },
    ]

    return columns;
};




export const UserActions = ({ participantId }) => {
    /**
     * transferParticipantActions is an array that contains the actions that can be performed on the transfer participant
     * The actions are: Approve/Reject, View Details, View Participant
     */
    const transferParticipantActions = [
        { value: 'edit', label: 'Edit', isEnable: true },
        { value: 'view', label: 'View', isEnable: true },
        { value: 'create', label: 'Create', isEnable: true },
        { value: 'delete', label: 'Delete', isEnable: true },
    ];

    const handleAction = async (action) => {
        if (action === 'delete') {
            const confirmed = window.confirm('Are you sure you want to delete this participant?');
            if (confirmed) {
                try {
                    const { error } = await supabase
                        .from('users') // Replace with your table name
                        .delete()
                        .eq('id', participantId); // Use the passed `participantId`

                    if (error) {
                        console.error('Error deleting participant:', error);
                        alert('Failed to delete participant. Please try again.');
                    } else {
                        alert('Participant deleted successfully.');
                    }
                } catch (err) {
                    console.error('Unexpected error:', err);
                }
            }
        } else {
            console.log(`Action selected: ${action}`);
            // Handle other actions here (e.g., edit, view, create)
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#7677F4] hover:text-[#7677F4]"
                >
                    <MoreVertical className="h-6 w-6" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="max-h-[300px] max-w-[170px] overflow-y-auto text-[#333333]"
            >
                {transferParticipantActions.map((option) => {
                    if (option?.isEnable) {
                        return (
                            <DropdownMenuItem
                                key={option.value}
                                className="cursor-pointer hover:!bg-[#7677F41A] hover:!text-[#7677F4]"
                                onClick={() => handleAction(option.value)}
                            >
                                {option?.label}
                            </DropdownMenuItem>
                        );
                    }
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

