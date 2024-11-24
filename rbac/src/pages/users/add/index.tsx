import Form from '@/components/FormField'
import React, { useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import CloseEyeIcon from '../../../../public/asserts/closeEyeIcon'
import OpenEyeIcon from '../../../../public/asserts/openEyeIcon'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/TextTags'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { MultiSelect } from '@/components/ui/multi-select'
import { CreateUserFormNames } from '@/constants/CreateUserConstants'
import { Textarea } from '@/components/ui/textarea'
import { generate } from "referral-codes";
import { NumberInput } from '@/components/ui/NumberInput'
import { handleSubmitUserDetails, IsEditUser } from '@/components/users/HandleCreateUser'
import { IsNewUser, IsCopyUser } from '@/components/users/HandleCreateUser'
import { useRouter } from "next/router";
import { usePathname } from 'next/navigation'
import { useValidateCurrentStepFields } from '@/utility/ValidationStaps'
// import Image from "next/image";
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
// import Tick from "@public/assets/Tick.png";

const index = () => {
  return (
    <div>
      <CreateUser />
    </div>
  )
}

export default index


export const CreateUser = () => {
  console.log("bhanuindexrobert")
  const { usersData } = usersStore()
  const onSubmit = (data: unknown) => {
    console.log("formbhanudata", data);
  };

  const defaultValues = usersData;
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
  const { watch } = useFormContext();
  const [statusUpdationDialogOpen, setStatusUpdationDialogOpen] =
    useState(false);
    const { ValidateCurrentStepFields } = useValidateCurrentStepFields();
  const [copiedUserCode, setCopiedUserCode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const formData = watch();

  //it is used to copy the user code
  const copyText = async (text: any) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

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
      router.replace("/courses/discount-code/list");
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
    if(isAllFieldsValidated){
    await handleSubmitUserDetails(formData)
    setStatusUpdationDialogOpen(true);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-[1200px] flex flex-col gap-8">
        <div className="flex justify-center   py-4">
          <p className="text-4xl font-semibold text-black">{IsEditUser(pathname)
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
          <div className="w-[310px] col-span-full lg:col-span-3">
            <AddressDetails />
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="h-[46px] min-w-[150px] md:min-w-[210px] rounded-lg border-2 border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-100"
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
            className="flex h-[394px] w-[484px] flex-col items-center justify-center !rounded-[15px] !p-4"
          >
            <DialogHeader>
              <div className="flex w-full items-center justify-center">
                {/* <Image src={Tick} alt="tick" /> */}
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
            <DialogFooter>
              {IsNewUser(pathname) ? (
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
                      className="h-[46px] min-w-[142px] rounded-[12px] border border-[#7677F4] font-bold leading-5 text-[#7677F4]"
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
                      className="h-[46px] min-w-[210px] rounded-[12px] bg-[#7677F4] px-4 py-2 leading-5 text-white"
                      onClick={handleClickFind}
                      disabled={loading}
                    >
                      Find users
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-[46px] min-w-[210px] rounded-[12px] bg-[#7677F4] px-4 py-2 leading-5 text-white"
                    onClick={handleClickFind}
                    disabled={loading}
                  >
                    Go to Find Users Page
                  </Button>
                </div>
              )}
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

//   const {
//     field: { value, onChange },
//     fieldState: { error },
//   } = useController({
//     name: CreateUserFormNames?.phone_number,
//   });

//   // Function to store the preprocessed max capacity input value
//   const handleMaxCapacityChange = (value: any) => {
//     onChange(value);
//   };

//   return (
//     <div className="flex flex-col gap-1">
//       <div className="flex flex-row items-center gap-1">
//         <Text className="text-xs font-normal text-[#333333]">
//           Phone Number
//         </Text>
//         <Text className="text-[#7677F4]">*</Text>
//       </div>
//       <Input
//         placeholder="Enter phone number"
//         value={value}
//         onChange={(e) => {
//           handleMaxCapacityChange(e.target.value);
//         }}
//         className="rounded-[12px] text-[14px] text-black"
//       />
//       {error && (
//         <span className="!w-[320px] break-all text-[12px] text-[#FF6D6D]">
//           {error?.message}
//         </span>
//       )}
//     </div>
//   );
// };



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
        className="w-full !rounded-xl text-sm font-normal placeholder:text-[#999999]"
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

  // //this is used to show the validation error messages to the disocunt code
  // useEffect(() => {
  //   const validateDiscountCode = async () => {
  //     const { data } = await supabaseClient()
  //       .from("org_product_discount_code")
  //       .select("discount_code")
  //       .eq("discount_code", value);

  //     setDiscountCodeValidation(data);
  //   };
  //   validateDiscountCode();
  // }, [value, setDiscountCodeValidation]);



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
            />
          </div>
          <Button
            onClick={createUserCode}
            className="flex flex-[3] w-full items-center justify-center rounded-[12px] px-4 py-3 bg-blue-500 hover:bg-blue-700"
            type="button"
          >
            Generate
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
  // use controller for role
  const {
    field: { value: role, onChange: onSelectedRole },
  } = useController({
    name: CreateUserFormNames?.role,
  });


  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[black]">
          Role
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div className="w-[300px]">
        <MultiSelect
          value={role}
          placeholder={"Select Role"}
          // data={roleData}
          onBottomReached={() => { }}
          onChange={(val: any) => {
            onSelectedRole(val);
            modifyRoleFormData(val);
            if (val?.includes(teacherRole)) {
              setValue("root_product_teacher", [
                {
                  root_product_id: undefined,
                  ttp_certification_type: undefined,
                },
              ]);
            } else {
              setValue("root_product_teacher", []);
            }
          }}
          onSearch={() => { }}
          searchBar={false}
          variant="basic"
        />
      </div>
    </div>
  )
}



export const StatusDropdown = () => {
  const {
    field: { value: selectedStatus, onChange: setSelectedStatus },
  } = useController({
    name: CreateUserFormNames?.status,
  });

  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
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
          <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-black">
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
    </div>
  );
};
