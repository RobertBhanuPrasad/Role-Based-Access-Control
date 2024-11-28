import Form from '@/components/FormField'
import React, { useEffect, useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import CloseEyeIcon from '../../../../public/asserts/closeEyeIcon'
import OpenEyeIcon from '../../../../public/asserts/openEyeIcon'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/TextTags'
import { Input } from '@/components/ui/input'
import MultipleSelector from '@/components/ui/MultiSelect'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import _ from "lodash";
import { CreateUserFormNames } from '@/constants/CreateUserConstants'
import { Textarea } from '@/components/ui/textarea'
import { generate } from "referral-codes";
import { NumberInput } from '@/components/ui/NumberInput'
import { handleSubmitUserDetails, IsEditUser } from '@/components/users/HandleCreateUser'
import { IsNewUser, IsCopyUser } from '@/components/users/HandleCreateUser'
import { useRouter } from "next/router";
import { usePathname } from 'next/navigation'
import { useValidateCurrentStepFields } from '@/utility/ValidationStaps'
import CopyIcon from '../../../../public/asserts/CopyIcon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { usersStore } from '@/ZustandStore/UsersStore'
import { CreateUserSchema } from '@/components/users/CreateUserValidations'
import { supabase } from '@/utility/SupabaseClient'
import RedReverseIcon from '../../../../public/asserts/RedReverseIcon'
import Exclamation from '../../../../public/asserts/Exclamation'

const index = () => {
  return (
    <div>
      <CreateUser />
    </div>
  )
}

export default index;


export const CreateUser = () => {
  console.log("bhanuindexrobert")
  const { usersData, setRolesData, setPermissionsData } = usersStore()
  const [loading, setLoading] = useState(false);
  const pathname = usePathname()
  const onSubmit = (data: unknown) => {
    console.log("formbhanudata", data);
  };


  // This `useEffect` hook is used to fetch roles and permissions data from Supabase when the component mounts. It triggers an asynchronous function to retrieve the data, sets the loading state to `true` during the fetch, and updates the `rolesData` and `permissionsData` states accordingly. If any errors occur during the fetch, they are logged to the console. The `loading` state is set to `false` after the fetch process completes, regardless of whether it succeeds or fails. The effect only runs once when the component is mounted due to the empty dependency array.
  useEffect(() => {
    const fetchRolesAndPermissions = async () => {
      try {
        setLoading(true); // Start loading state
        const { data: roles, error: rolesError } = await supabase.from('roles').select('*').order('id', { ascending: false }); // Fetch roles
        if (rolesError) console.error('Error fetching roles:', rolesError); else setRolesData(roles || []); // Handle roles data/error
        const { data: permissions, error: permissionsError } = await supabase.from('permissions').select('*').order('id', { ascending: false }); // Fetch permissions
        if (permissionsError) console.error('Error fetching permissions:', permissionsError); else setPermissionsData(permissions || []); // Handle permissions data/error
      } catch (error) {
        console.error('Unexpected error:', error); // Log unexpected errors
      } finally {
        setLoading(false); // Stop loading state
      }
    };
    fetchRolesAndPermissions(); // Call the function
  }, []); // Run effect on mount only

  let defaultValues: any = {
  };

  if (IsEditUser(pathname)) {
    defaultValues = usersData;
  }

  console.log(defaultValues, usersData, "defaultvalueaddbhanuprasadrobert")
  return (
    <div className="">
      <div>
        <Form
          onSubmit={onSubmit}
          schema={CreateUserSchema}
          defaultValues={defaultValues}
        >
          <CreateUserPage />
        </Form>
      </div>
    </div>
  )
}


const requireFeilds = () => {
  const NewUserStepFields = [
    Object.values(CreateUserFormNames),
  ];

  return NewUserStepFields;
};

export const CreateUserPage = () => {
  console.log("robertcreate")
  const { watch, getValues } = useFormContext();
  const { usersData } = usersStore()
  const [statusUpdationDialogOpen, setStatusUpdationDialogOpen] =
    useState(false);
  const [cancelOpenDialog, setCancelOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { rolesData } = usersStore()
  const { ValidateCurrentStepFields } = useValidateCurrentStepFields();
  const [copiedUserCode, setCopiedUserCode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const formData = watch();

  //it is used to copy the user code
  const copyText = async (text: any) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };


  if (loading) {
    return <p>Loading roles...</p>;
  }




  console.log(rolesData, "rolesdatabhanuprasad")

  const handleCopyDetailsPageLink = (textToCopy: string) => {
    copyText(textToCopy);
    setCopiedUserCode(true);

    setTimeout(() => {
      setCopiedUserCode(false);
    }, 1000);
  };

  const handleClickFind = () => {
    setLoading(true);
    const newPath = pathname;
    if (IsEditUser(newPath)) {
      const newPathUpdate = newPath
        .replace(/\/\d+/, "")
        .replace(/\/(edit)/, "");
      router.push(`${newPathUpdate}/list`);
    } else {
      router.replace("/users/list");
    }
  };

  const handleClickNew = () => {
    setLoading(true);
    if (IsEditUser(pathname)) {
      const newPath = router.pathname
        .replace(/\/\[id\]/, "")
        .replace(/\/(edit)/, "");
      router.replace(`${newPath}/add`).then(() => {
        router.reload();
      });
    } else {
      router.reload();
    }
  };


  console.log("heyy form databhanurobert", formData);
  const handleCreate = async (newUserFormNames: any[]) => {
    // Validate fields in the current step before proceeding
    const isAllFieldsValidated = await ValidateCurrentStepFields(
      newUserFormNames
    );
    console.log(isAllFieldsValidated, "isallfieldsbhanuprasad")
    if (isAllFieldsValidated) {
      await handleSubmitUserDetails(formData)
      setStatusUpdationDialogOpen(true);
    }
  }

  const handleCancelClick = () => {
    //if the formData from getValues and course accounting form values are same we will navigate to course accounting form tab
    // it means no changes are made so we can back no problem
    //if user changed anything we will open dialog box
    const formData = getValues();

    const isEqual =
      _.isEqual(
        formData?.program_expenses,
        usersData
      )

    if (isEqual) {
      // If no changes were made, proceed to navigate to the specified course page.
      // The 'course_accounting_form' tab will be active, and 'is_cancel=true' is added to the URL.
      // The 'is_cancel=true' parameter indicates that the form submission is complete,
      // allowing the destination page to handle post-submission logic, like displaying a success message.
      router.reload();
    } else {
      // if anything is changed we will open the dialog
      setCancelOpenDialog(true);
    }
  }

  const handleCancelDialogYesClick = () => {
    setCancelOpenDialog(false);
    // After confirming, navigate to the specified course page.
    // The 'course_accounting_form' tab will be active, and 'is_cancel=true' is added to the URL.
    // The 'is_cancel=true' parameter indicates that the form submission is complete,
    // allowing the destination page to trigger any necessary post-submission actions,
    // such as displaying a success message or processing form data.
    router.reload()
  };

  const handleCancelDialogNoClick = () => {
    setCancelOpenDialog(false);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-[1200px] flex flex-col gap-8">
        <div className="flex justify-center py-4">
          <p className="text-4xl text-blue-500 font-semibold text-center mb-6">{IsEditUser(pathname)
            ? "Edit"
            : "Create"}{" "} User</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          <div className="min-h-20 w-80">
            <FirstName />
          </div>
          <div className="min-h-20 w-80">
            <LastName />
          </div>
          <div className="min-h-20 w-80">
            <Email />
          </div>
          <div className="min-h-20 w-80">
            <Password />
          </div>
          <div className="min-h-20 w-80">
            <PhoneNumber />
          </div>
          <div className="min-h-20 w-80">
            <GenerateUseCode />
          </div>
          <div className="min-h-20 w-80">
            <StatusDropdown />
          </div>
          <div className="min-h-20 w-80">
            <RoleDropDown />
          </div>
          <div className="min-h-20 w-80"><PermissionsDropDown /></div>
          <div className="w-[310px] col-span-full lg:col-span-3">
            <AddressDetails />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="h-[46px] min-w-[150px] md:min-w-[210px] rounded-lg border-2 border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-100"
            onClick={() => handleCancelClick()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-[46px] min-w-[150px] md:min-w-[210px] rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={async () => {
              const validateNewUser = requireFeilds();
              await handleCreate(validateNewUser[0])
            }}
          >
            Create User
          </Button>
        </div>

        {/* Dialog open */}
        <Dialog open={statusUpdationDialogOpen}>
          <DialogContent
            closeIcon={false}
            className="flex h-[394px] w-[484px] flex-col  !rounded-[15px] !p-4 bg-white"
          >
            <DialogHeader className='pt-10 gap-3'>
              <div className="flex w-full items-center justify-center">
                <RedReverseIcon />
              </div>
              <DialogDescription className="flex flex-col items-center gap-4 text-center text-[20px] font-semibold text-[#333333]">
                <div className="text-[20px] font-semibold">
                  {IsNewUser(pathname) ||
                    IsCopyUser(pathname)
                    ? "Your new User has been successfully created"
                    : "Your User has been successfully updated"}
                </div>

                <div className="flex min-h-[40px] min-w-[140px] justify-between gap-2 rounded-2xl border px-3 py-2 text-sm">
                  {formData?.user_code ? (
                    <span className="font-semibold text-primary underline">
                      {formData?.user_code}
                    </span>
                  ) : (
                    <p className="font-semibold">
                      no user code is found
                    </p>
                  )}
                  {formData?.user_code && (
                    <div
                      onClick={() => {
                        handleCopyDetailsPageLink(
                          formData?.discount_code
                        );
                      }}
                      className="relative mt-1 h-[20px] cursor-pointer"
                    >
                      <CopyIcon />
                      {copiedUserCode ? (
                        <div className="absolute w-[85px] rounded-md bg-black px-4 py-2 text-base text-[white] shadow-md first-letter:capitalize sm:-left-8 sm:bottom-12">
                          copied
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className='pt-6 gap-3'>
              <div className="flex w-full items-center justify-center gap-5">
                {loading && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[white]/50 opacity-100">
                    <div className="loader"></div>
                  </div>
                )}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-[46px] min-w-[142px] rounded-[12px] border border-blue-500 font-bold leading-5 text-blue-500"
                    onClick={handleClickNew}
                    disabled={loading}
                  >
                    Create new
                  </Button>
                </div>
                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-[46px] min-w-[210px] rounded-[12px] bg-blue-500 px-4 py-2 leading-5 text-white hover:bg-blue-700"
                    onClick={handleClickFind}
                    disabled={loading}
                  >
                    Go to Find Users Page
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={cancelOpenDialog} onOpenChange={setCancelOpenDialog}>
          <DialogContent className="flex w-[425px] flex-col !rounded-[15px] !p-6 bg-[white] text-black">
            <DialogHeader>
              <div className="flex w-full items-center justify-center">
                <Exclamation />
              </div>
              <DialogDescription className="items-center text-center text-[20px] font-semibold text-[#333333]">
                Are you sure you want to cancel the changes
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <div className="flex w-full items-center justify-center gap-5">
                <Button
                  onClick={handleCancelDialogNoClick}
                  className="border border-[blue] bg-white text-[#7677F4]"
                >
                  no
                </Button>
                <Button
                  className='bg-blue-500 text-white'
                  onClick={handleCancelDialogYesClick}>
                  Yes
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>


  );
};



export const FirstName = ({ index }: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: CreateUserFormNames?.first_name });


  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          First Name
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div>
        <Input
          placeholder="Enter first name"
          value={value}
          onChange={(val) => {
            onChange(val?.target?.value);
          }}
          className="rounded-[12px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          id={`step-6-contact-name-${index}`}
          error={error ? true : false}
        />
        {error && (
          <span className="text-[12px] text-[#FF6D6D]">{error?.message}</span>
        )}
      </div>
    </div>
  );
};




export const LastName = ({ index }: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: CreateUserFormNames?.last_name });


  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          Last Name
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div>
        <Input
          placeholder="Enter last name"
          value={value}
          onChange={(val) => {
            onChange(val?.target?.value);
          }}
          className="rounded-[12px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          id={`step-6-contact-name-${index}`}
          error={error ? true : false}
        />
        {error && (
          <span className="text-[12px] text-[#FF6D6D]">{error?.message}</span>
        )}
      </div>
    </div>
  );
};


export const Email = ({ index }: any) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({ name: CreateUserFormNames?.email });


  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          Email
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div>
        <Input
          placeholder="Enter email"
          value={value}
          onChange={(val) => {
            onChange(val?.target?.value);
          }}
          className="rounded-[12px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          id={`step-6-contact-name-${index}`}
          error={error ? true : false}
        />
        {error && (
          <span className="text-[12px] text-[#FF6D6D]">{error?.message}</span>
        )}
      </div>
    </div>
  );
};

export const Password = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const pathname = usePathname()
  const {
    field: { value: password, onChange: onPassword },
    fieldState: { error },
  } = useController({ name: CreateUserFormNames?.password });

  return (
    <div className="flex flex-col gap-2 mt-0">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          Password
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div className=" ml-[10px] flex h-[40px] w-[320px] items-center justify-between rounded-[12px] border-[2px] border-black border-inherit p-1 pl-[15px] outline-none focus:border-blue-700">
        <Input
          type={passwordShow ? "text" : "password"}
          value={password}
          className="rounded-[12px] text-black focus:outline-none focus:ring-2 focus:ring-blue-500 w-full !border-none h-fit "
          onChange={(e) => {
            e.stopPropagation();
            onPassword(e.target.value);
          }}
          error={error ? true : false}
          disabled={IsEditUser(pathname)}
          placeholder="Enter password"
        />
        <span
          tabIndex={3}
          className="mr-[10px] cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setPasswordShow(!passwordShow);
          }}
          onKeyDown={(e) => {
            if (e.code === "Enter" || e.code === "Space") {
              setPasswordShow(!passwordShow);
            }
          }}
        >
          {passwordShow ? <CloseEyeIcon /> : <OpenEyeIcon />}
        </span>
      </div>
      {error && (
        <span className="text-[12px] text-[#FF6D6D]">{error?.message}</span>
      )}
    </div>
  )
}




export const PhoneNumber = () => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: CreateUserFormNames?.phone_number,
  });

  // Function to store the preprocessed max capacity input value
  const handleMaxCapacityChange = (value: any) => {
    onChange(value);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          Phone Number
        </Text>
        <Text className="text-[#7677F4]">*</Text>

      </div>
      <NumberInput
        placeholder="Enter Phone number"
        value={value}
        onChange={(e) => {
          handleMaxCapacityChange(e.target.value);
        }}
        className="rounded-[12px] text-[14px] text-black"
        error={error ? true : false}
        extendedType="number-input"
      />
      {error && (
        <span className="!w-[320px] break-all text-[12px] text-[#FF6D6D]">
          {error?.message}
        </span>
      )}
    </div>
  );
};



export const AddressDetails = () => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: CreateUserFormNames?.address,
  });


  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          Address
        </Text>{" "}
      </div>
      <Textarea
        value={value}
        onChange={(val) => {
          onChange(val?.target?.value);
        }}
        placeholder="Enter the address"
        className="w-full !rounded-xl text-sm font-normal placeholder:text-[black] text-black"
        error={error ? true : false}
      />
      {error && (
        <span className="text-[12px] text-[#FF6D6D]">{error?.message}</span>
      )}
    </div>
  );
};


export const GenerateUseCode = () => {
  const {
    field: { value, onChange },
    fieldState: { error: discountCodeError },
  } = useController({
    name: CreateUserFormNames?.user_code,
  });

  function createUserCode() {
    const userCodeArray = generate({
      length: 9,
      count: 1,
      charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    });

    onChange(userCodeArray?.[0]);
  }



  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[black]">
          Enter user code
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div className="flex w-[300px] flex-row gap-2">
        <div className="flex w-full items-center gap-4">
          <div className="flex-[7] text-black">
            <Input
              readOnly={true}
              value={value}
              className="w-full rounded-[12px]"
              error={discountCodeError ? true : false}
            />
          </div>
          <Button
            onClick={createUserCode}
            className="flex flex-[3] w-full items-center justify-center rounded-[12px] px-4 py-3 bg-blue-500 hover:bg-blue-700"
            type="button"
          >
            Generate code
          </Button>
        </div>
      </div>
      {discountCodeError && (
        <span className="text-xs font-semibold text-[#FF6D6D]">
          {discountCodeError?.message}
        </span>
      )}
    </div>
  );
};


export const RoleDropDown = () => {
  const { rolesData } = usersStore(); // Assuming usersStore is fetching the roles data
  console.log(rolesData, "rolesdatabhanurobert");

  // Process roles data
  const validRoles = Array.isArray(rolesData)
    ? rolesData
      .filter((role) => role.name?.trim()) // Filter out invalid roles
      .map((role) => ({
        label: role.name,
        value: role.id,
      }))
    : [];

  console.log(validRoles, "validrolesrobert");

  // UseController hook to manage form state
  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({
    name: 'role', // Form field name for the role
    defaultValue: [], // Set default value to an empty array
  });

  return (
    <div className="flex flex-col gap-2 text-black">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">Roles</Text>
        <Text className="text-[#7677F4]">*</Text>
      </div>

      <MultipleSelector
        options={validRoles}
        placeholder="Select roles you like..."
        value={value}  // Bind value to form state
        onChange={(selected) => {
          onChange(selected); // Store the selected values in form data
        }}
        className="rounded-[12px] text-[14px] text-black bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        emptyIndicator={
          <p className="text-center text-sm md:text-base lg:text-lg leading-10 text-gray-600 dark:text-gray-400">
            No results found.
          </p>
        }
      />

      {/* Error Message Display */}
      {error && (
        <span className="text-[12px] text-[#FF6D6D]">
          {error?.message}
        </span>
      )}
    </div>
  );
};



export const PermissionsDropDown = () => {
  const { permissionsData } = usersStore(); // Assuming usersStore is fetching the roles data
  console.log(permissionsData, "rolesdatabhanurobert");

  // Process roles data
  const validPermissions = Array.isArray(permissionsData)
    ? permissionsData
      .filter((role) => role.name?.trim()) // Filter out invalid roles
      .map((role) => ({
        label: role.name,
        value: role.id,
      }))
    : [];

  console.log(validPermissions, "validrolesrobert");

  // UseController hook to manage form state
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: 'permissions', // Form field name for the role
    defaultValue: [], // Set default value to an empty array
  });

  return (
    <div className="flex flex-col gap-2 text-black">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">Permissions</Text>
        <Text className="text-[#7677F4]">*</Text>
      </div>

      <MultipleSelector
        options={validPermissions}
        placeholder="Select permissions you like..."
        value={value}  // Bind value to form state
        onChange={(selected) => {
          onChange(selected); // Store the selected values in form data
        }}
        className="rounded-[12px] text-[14px] text-black bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        emptyIndicator={
          <p className="text-center text-sm md:text-base lg:text-lg leading-10 text-gray-600 dark:text-gray-400">
            No results found.
          </p>
        }
      />

      {/* Error Message Display */}
      {error && (
        <span className="text-[12px] text-[#FF6D6D]">
          {error?.message}
        </span>
      )}
    </div>
  );
};


export const StatusDropdown = () => {
  const {
    field: { value: selectedStatus, onChange: setSelectedStatus },
    fieldState: { error }
  } = useController({
    name: CreateUserFormNames?.status,
  });

  const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ];

  const handleChange = (value: string) => {
    setSelectedStatus(value);
    console.log("Selected Status:", value);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">Status</Text>
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div className="w-full max-w-xs">
        <Select
          value={selectedStatus}
          onValueChange={(value) => handleChange(value)}
        >
          <SelectTrigger className="w-full border border-gray-300 rounded-[12px] px-3 py-2 text-sm text-black" error={error ? true : false}>
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent className="rounded-lg">
            {statusOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-sm py-2 text-black rounded-lg"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && (
        <span className="text-xs font-semibold text-[#FF6D6D]">
          {error?.message}
        </span>
      )}
    </div>
  );
};
