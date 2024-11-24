"use-client"
import { useRouter } from "next/router";
import SlashIcon from "@/ui/SlashIcon";

type breadCrumbDataType = {
    [key: string]: {
        label: string;
        className: string;
        href: string;
    }[];
};

export const Breadcrumb = () => {
    const router = useRouter();

    const breadCrumbData: breadCrumbDataType = {
        // Users Section
        "/users/list": [
            {
                label: "Users",
                className: "",
                href: "/users/list",
            },
        ],
        "/users/add": [
            {
                label: "Users",
                className: "text-primary cursor-pointer",
                href: "/users/list",
            },
            {
                label: "New User",
                className: "",
                href: "",
            },
        ],
        "/users/[id]/edit": [
            {
                label: "Users",
                className: "text-primary cursor-pointer",
                href: "/users/list",
            },
            {
                label: "Edit User",
                className: "",
                href: "",
            },
        ],

        // Roles Section
        "/roles/list": [
            {
                label: "Roles",
                className: "",
                href: "/roles/list",
            },
        ],
        "/roles/add": [
            {
                label: "Roles",
                className: "text-primary cursor-pointer",
                href: "/roles/list",
            },
            {
                label: "New Role",
                className: "",
                href: "",
            },
        ],
        "/roles/[id]/edit": [
            {
                label: "Roles",
                className: "text-primary cursor-pointer",
                href: "/roles/list",
            },
            {
                label: "Edit Role",
                className: "",
                href: "",
            },
        ],

        // Permissions Section
        "/permissions/list": [
            {
                label: "Permissions",
                className: "",
                href: "/permissions/list",
            },
        ],
        "/permissions/add": [
            {
                label: "Permissions",
                className: "text-primary cursor-pointer",
                href: "/permissions/list",
            },
            {
                label: "New Permission",
                className: "",
                href: "",
            },
        ],
        "/permissions/[id]/edit": [
            {
                label: "Permissions",
                className: "text-primary cursor-pointer",
                href: "/permissions/list",
            },
            {
                label: "Edit Permission",
                className: "",
                href: "",
            },
        ],
    }

    /**
     * based on the current path as key  retrieve the corresponding value
     */
    const data = breadCrumbData[`${router.pathname}`];

    return (
        <div className="flex h-[32px] shrink-0 items-center bg-[#F9F9F9] pl-8 text-[12px] font-normal drop-shadow-md">
            {/* <HomeIcon /> */}
            <div className="flex">
                {data?.map((label: any, index: number) => {
                    const isLastLabel = index === data.length - 1; // Check if it's the last label
                    return (
                        <p
                            key={index}
                            className={`${label.className} flex items-center`}
                            onClick={() => {
                                // Check if it's not the last label and not the Home page
                                if (!isLastLabel) {
                                    router.push(`${label.href}`);
                                }
                            }}
                        >
                            &nbsp;
                            {label.label}
                            &nbsp;
                            {!isLastLabel && <SlashIcon />}{" "}
                            {/* Render '/' only if it's not the last label */}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};
