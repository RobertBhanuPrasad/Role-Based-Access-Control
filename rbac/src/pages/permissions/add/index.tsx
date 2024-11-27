import React, { useState } from 'react';
import Form from '@/components/FormField'
import { useFormContext, useController } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PermissionsFormNames } from '@/constants/PermissionConstants';
import { useValidateCurrentStepFields } from '@/utility/ValidationStaps'
import { handleSubmitPermissionDetails } from '@/components/permissions/HandlePermissions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import { IsEditPermission, IsNewPermission } from '@/components/permissions/HandlePermissions';
import { CreatePermissionSchema } from '@/components/permissions/PermissionsValidations';
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { usersStore } from '@/ZustandStore/UsersStore';
import RedReverseIcon from '../../../../public/asserts/RedReverseIcon';


const CreatePermission = () => {
  const onSubmit = (data: unknown) => {
    console.log("form data", data);
  };
  const { permissionsDefaultData } = usersStore()
  
  let  defaultValues = {}

  defaultValues = permissionsDefaultData

  console.log(defaultValues, permissionsDefaultData, "defaultvaluespermissions")
  return (
    <div className="">
      <div>
        <Form onSubmit={onSubmit}
          schema={CreatePermissionSchema}
          defaultValues={defaultValues}
        >
          <CreatPermissionsPage />
        </Form>
      </div>
    </div>
  );
}

export default CreatePermission;

const requireFeilds = () => {
  const NewPermissionStepFields = [
    Object.values(PermissionsFormNames),
  ];

  return NewPermissionStepFields;
};

export const CreatPermissionsPage = () => {
  const [loading, setLoading] = useState(false);
  const { getValues } = useFormContext();
  const { ValidateCurrentStepFields } = useValidateCurrentStepFields();
  const [statusUpdationDialogOpen, setStatusUpdationDialogOpen] =
    useState(false);
  const router = useRouter();
  const pathname = usePathname()
  const formData = getValues();

  const {
    field: { value: permissionName, onChange: onPermissionName },
    fieldState: { error: permissionNameError },
  } = useController({
    name: PermissionsFormNames?.permissionName,
  });

  // Use controller for permission description
  const {
    field: { value: description, onChange: onDescription },
    fieldState: { error: descriptionError },
  } = useController({
    name: PermissionsFormNames?.description,
  });

  // Use controller for permission type
  const {
    field: { value: permissionType, onChange: onPermissionType },
    fieldState: { error: permissionTypeError },
  } = useController({
    name: PermissionsFormNames?.permissionType,
  });

  // Use controller for permission category
  const {
    field: { value: permissionCategory, onChange: onPermissionCategory },
    fieldState: { error: permissionCategoryError },
  } = useController({
    name: PermissionsFormNames?.permissionCategory,
  });


  const handleCreatePermission = async (NewPermissionStepFields: any[]) => {
    setLoading(true)

    // Validate fields in the current step before proceeding
    const isAllFieldsValidated = await ValidateCurrentStepFields(
      NewPermissionStepFields
    );
    console.log(isAllFieldsValidated, "isallfieldsbhanuprasad")
    if (isAllFieldsValidated) {
      await handleSubmitPermissionDetails(formData)
      setStatusUpdationDialogOpen(true);
    }
  }


  const handleClickFind = () => {
    setLoading(true);
    const newPath = pathname;
    if (IsEditPermission(newPath)) {
      const newPathUpdate = newPath
        .replace(/\/\d+/, "")
        .replace(/\/(edit)/, "");
      router.push(`${newPathUpdate}/list`);
    } else {
      router.replace("/permissions/list");
    }
  };

  const handleClickNew = () => {
    setLoading(true);
    if (IsEditPermission(pathname)) {
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

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-wrap justify-center gap-6 w-full items-center">
        {/* Card 1 */}
        <div className="w-full sm:w-[48%] lg:w-[40%] max-w-md bg-white p-6 shadow-md rounded-lg">
        <div className="flex justify-center py-4">
          <p className="text-4xl text-blue-500 font-semibold text-center mb-6">{IsEditPermission(pathname)
            ? "Edit"
            : "Create"}{" "} Permission</p>
        </div>
          <div className="flex flex-col gap-y-6">
            {/* Permission Name */}
            <div className="form-control flex flex-col">
              <label htmlFor="permissionName" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] text-black">Permission Name</span>
              </label>
              <Input
                type="text"
                id="permissionName"
                placeholder="Enter permission name"
                className="h-[40px] text-black w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-500"
                value={permissionName}
                onChange={onPermissionName}
              />
              {permissionNameError && (
                <span className="text-red-500 text-sm mt-2">{permissionNameError.message}</span>
              )}
            </div>
            {/* Permission Type */}
            <div className="form-control flex flex-col">
              <label htmlFor="permissionType" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] text-black">Permission Type</span>
              </label>
              <Input
                type="text"
                id="permissionType"
                placeholder="Enter permission type"
                className="h-[40px] w-full text-black rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-500"
                value={permissionType}
                onChange={onPermissionType}
              />
              {permissionTypeError && (
                <span className="text-red-500 text-sm mt-2">{permissionTypeError.message}</span>
              )}
            </div>
            {/* Permission Category */}
            <div className="form-control flex flex-col">
              <label htmlFor="permissionCategory" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] text-black">Permission Category</span>
              </label>
              <Input
                type="text"
                id="permissionCategory"
                placeholder="Enter permission category"
                className="h-[40px] w-full text-black rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-500"
                value={permissionCategory}
                onChange={onPermissionCategory}
              />
              {permissionCategoryError && (
                <span className="text-red-500 text-sm mt-2">{permissionCategoryError.message}</span>
              )}
            </div>
            {/* Description */}
            <div className="form-control flex flex-col">
              <label htmlFor="description" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] text-black">Description</span>
              </label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="h-[80px] w-full text-black rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-500"
                value={description}
                onChange={onDescription}
              />
              {descriptionError && (
                <span className="text-red-500 text-sm mt-2">{descriptionError.message}</span>
              )}
            </div>
            {/* Submit Button */}
            <div className="form-control flex justify-center mt-6">
              <Button
                type="button"
                className="h-[46px] min-w-[106px] rounded-[12px] bg-blue-500 hover:bg-blue-600 text-base font-bold"
                onClick={async () => {
                  const validatePermission = requireFeilds();
                  await handleCreatePermission(validatePermission[0]);
                }}
                disabled={loading}
              >
                {loading && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[white]/50 opacity-100">
                    <div className="loader"></div>
                  </div>
                )}
                Create Permission
              </Button>
            </div>
          </div>
        </div>
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
                {IsNewPermission(pathname)
                  ? "Your new Role has been successfully created"
                  : "Your Role has been successfully updated"}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='pt-[100px] gap-3'>
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
                  className="h-[46px] min-w-[210px] rounded-[12px] bg-blue-500 px-4 py-2 leading-5 text-white"
                  onClick={handleClickFind}
                  disabled={loading}
                >
                  Go to Find Roles Page
                </Button>
              </div>
              </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};


