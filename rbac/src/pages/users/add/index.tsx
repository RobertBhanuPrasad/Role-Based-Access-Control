import Form from '@/components/FormField'
import React, { useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import CloseEyeIcon from '../../../../public/asserts/closeEyeIcon'
import OpenEyeIcon from '../../../../public/asserts/openEyeIcon'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/TextTags'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
// import { MultiSelect } from '@/components/ui/multi-select'
import { CreateUserFormNames } from '@/constants/CreateUserConstants'
import { Textarea } from '@/components/ui/textarea'
import { generate } from "referral-codes";

const index = () => {
  const onSubmit = (data: unknown) => {
    console.log("formbhanudata", data);
  };
  return (
    <div className="">
      <div>
        <Form
          onSubmit={onSubmit}
        >
          <CreateUserPage />
        </Form>
      </div>
    </div>
  )
}

export default index



export const CreateUserPage = () => {
  const { watch } = useFormContext();

  const formData = watch();

  console.log("heyy form data", formData);

  return (
    <div className='mx-auto w-full min-w-[1000px] max-w-[1640px] px-8 pb-8'>
      <div className="flex flex-wrap gap-x-8 gap-y-6 bg-white min-h-screen">
        <div className="min-h-20 w-80">
          <FirstName />
        </div>
        <div className="min-h-20 w-80">
          <LastName />
        </div>
        <div className="min-h-20 w-80">
          <Email />
        </div>
        <div>
            <Password />
        </div>
        <div className="min-h-20 w-80">
            <StatusDropdown />
        </div>
        <div className="min-h-20 w-80">
          role drop down
            {/* <RoleDropDown /> */}
        </div>
        <div className="min-h-20 w-80">
          <AddressDetails/>
        </div>
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
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          First Name
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div>
        <Input
          placeholder="Email"
          value={value}
          onChange={(val) => {
            onChange(val?.target?.value);
          }}
          error={error ? true : false}
          className="rounded-[12px]"
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
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          Last Name
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div>
        <Input
          placeholder="Email"
          value={value}
          onChange={(val) => {
            onChange(val?.target?.value);
          }}
          error={error ? true : false}
          className="rounded-[12px]"
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
    <div className="flex flex-col gap-1">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          First Name
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div>
        <Input
          placeholder="Email"
          value={value}
          onChange={(val) => {
            onChange(val?.target?.value);
          }}
          error={error ? true : false}
          className="rounded-[12px]"
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
    <div className="form-control mt-0 flex items-center justify-between">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
         Password
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div className="ml-[10px] flex h-[40px] w-[300px] items-center justify-between rounded-[12px] border-[2px] border-black border-inherit p-1 pl-[15px] outline-none focus:border-blue-700">
        <input
          type={passwordShow ? "text" : "password"}
          value={password}
          className="focus:outline-none"
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



export const phoneNumber = () => {
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
          {t("bx_v7:caf_number_of_uses_allowed")}
        </Text>
        <Text className="text-[#7677F4]">*</Text>

      </div>
      <Input
        placeholder={t("bx_v7:caf_enter_no_of_uses")}
        value={value}
        onChange={(e) => {
          handleMaxCapacityChange(e.target.value);
        }}
        className="rounded-[12px] text-[14px]"
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
    <div className="flex w-full flex-col gap-1">
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

  function createDiscountCode() {
    const discountCodeArray = generate({
      length: 9,
      count: 1,
      charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    });

    onChange(discountCodeArray?.[0]);
  }

  //this is used to show the validation error messages to the disocunt code
  useEffect(() => {
    const validateDiscountCode = async () => {
      const { data } = await supabaseClient()
        .from("org_product_discount_code")
        .select("discount_code")
        .eq("discount_code", value);

      setDiscountCodeValidation(data);
    };
    validateDiscountCode();
  }, [value, setDiscountCodeValidation]);

  const handleCodeChange = (e: any) => {
    onChange(e.target.value);
  };



  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex flex-row items-center gap-1">
        <Text className="text-xs font-normal text-[#333333]">
          {t("bx_v1:cpm_mr_enter_discount_date")}
        </Text>{" "}
        <Text className="text-[#7677F4]">*</Text>
      </div>
      <div className="flex w-[300px] flex-row gap-2">
        {discountCodeType == customCode ? (
          <Input
            maxLength={24}
            value={value}
            error={!!discountCodeError}
            onChange={handleCodeChange}
            className="min-w-[320px] rounded-[12px]"
            placeholder={t("bx_v1:cpm_mr_enter_discount_date")}
          />
        ) : (
          <div className="flex w-full items-center gap-4">
            <div className="flex-[7]">
              <Input
                readOnly={true}
                value={value}
                error={!!discountCodeError}
                className="w-full rounded-[12px]"
              />
            </div>
            <Button
              onClick={createDiscountCode}
              className="flex flex-[3] items-center justify-center rounded-[12px] px-4 py-3"
              type="button"
            >
              {t("bx_v7:caf_generate")}
            </Button>
          </div>
        )}
      </div>
      {discountCodeError && (
        <span className="text-xs font-semibold text-[#FF6D6D]">
          {discountCodeError?.message}
        </span>
      )}
    </div>
  );
};

// export const RoleDropDown = () => {
//   // use controller for role
//   const {
//     field: { value: role, onChange: onSelectedRole },
//   } = useController({
//     name: CreateUserFormNames?.role,
//   });

//   const {
//     field: { value: role_id, onChange: onSelectedRoleIds },
//   } = useController({
//     name: "role_id",
//   });

//   // function for modify the role form data
//   const modifyRoleFormData = (id: number[]) => {
//     const result = id?.map((role) => {
//       const roleObject: any = roleQueryData?.data?.data?.find(
//         (roleData) => roleData?.code == role
//       );
//       return roleObject?.id;
//     });
//     onSelectedRoleIds(result);
//   };

//   return (
//     <div className="form-control flex items-center justify-between">
//       <label className="text-[20px] font-semibold">Role:</label>

//       <div className="w-[300px]">
//         <MultiSelect
//           value={role}
//           placeholder={"Select Role"}
//           // data={roleData}
//           onBottomReached={() => { }}
//           onChange={(val: any) => {
//             onSelectedRole(val);
//             modifyRoleFormData(val);
//             if (val?.includes(teacherRole)) {
//               setValue("root_product_teacher", [
//                 {
//                   root_product_id: undefined,
//                   ttp_certification_type: undefined,
//                 },
//               ]);
//             } else {
//               setValue("root_product_teacher", []);
//             }
//           }}
//           onSearch={() => { }}
//           searchBar={false}
//           variant="basic"
//           isInitialLoading={roleQueryData?.isLoading}
//           isFiltering={roleQueryData?.isFetching}
//         />
//       </div>
//     </div>
//   )
// }

export const StatusDropdown = () => {
  // const [selectedStatus, setSelectedStatus] = useState<string>("");

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
    <div className="w-full max-w-xs">
      <Select
        value={selectedStatus}
        onValueChange={(value) => handleChange(value)}
      >
        <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-sm py-2"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
