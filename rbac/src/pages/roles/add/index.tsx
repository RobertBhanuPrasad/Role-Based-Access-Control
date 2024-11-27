import Form from '@/components/FormField'
import React, { useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { RolesFormNames } from '@/constants/RolesConstants'
import { handleSubmitRoleDetails } from '@/components/roles/HandleRoles'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { IsNewRole, IsEditRole } from '@/components/roles/HandleRoles'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useValidateCurrentStepFields } from '@/utility/ValidationStaps'
import { useRouter } from "next/router";
import { usePathname } from 'next/navigation'
import { CreateRoleSchema } from '@/components/roles/RolesValidations'
import { usersStore } from '@/ZustandStore/UsersStore'
import RedReverseIcon from '../../../../public/asserts/RedReverseIcon'


const index = (): JSX.Element => {
  return <CreateRole />
}
export default index;

export const CreateRole = () => {
  const onSubmit = (data: unknown) => {
    console.log("form data", data);
  };
  const { roleDefaultData } = usersStore()
  const defaultValues = roleDefaultData;
  return (
    <div className="">
      <div>
        <Form onSubmit={onSubmit}
          schema={CreateRoleSchema}
          defaultValues={defaultValues}
        >
          <CreateRolePage />
        </Form>
      </div>
    </div>
  );
}


const requireFeilds = () => {
  const NewRoleStepFields = [
    Object.values(RolesFormNames),
  ];

  return NewRoleStepFields;
};

export const CreateRolePage = () => {
  const [loading, setLoading] = useState(false);
  const [statusUpdationDialogOpen, setStatusUpdationDialogOpen] =
    useState(false);
  const { ValidateCurrentStepFields } = useValidateCurrentStepFields();
  const { watch } = useFormContext();
  const router = useRouter();
  const pathname = usePathname();
  const formData = watch();
  console.log(formData, "formdataroles")
  // use controller for role name 
  const {
    field: { value: roleName, onChange: onRoleName },
    fieldState: { error: roleError }
  } = useController({
    name: RolesFormNames?.role_name,
  });

  // use controller for role description
  const {
    field: { value: description, onChange: onDescription },
    fieldState: { error: descriptionError }
  } = useController({
    name: RolesFormNames?.description,
  });


  const handleClickFind = () => {
    setLoading(true);
    const newPath = pathname;
    if (IsEditRole(newPath)) {
      const newPathUpdate = newPath
        .replace(/\/\d+/, "")
        .replace(/\/(edit)/, "");
      router.push(`${newPathUpdate}/list`);
    } else {
      router.replace("/roles/list");
    }
  };

  const handleClickNew = () => {
    setLoading(true);
    if (IsEditRole(pathname)) {
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


  const handleCreateRole = async (NewRoleStepFields: any[]) => {
    
    // Validate fields in the current step before proceeding
    const isAllFieldsValidated = await ValidateCurrentStepFields(
      NewRoleStepFields
    );
    
    if (isAllFieldsValidated) {
      await handleSubmitRoleDetails(formData)
      // setLoading(true)
      setStatusUpdationDialogOpen(true);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-wrap justify-center gap-6 w-full p-4">
        <div className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
        <div className="flex justify-center py-4">
          <p className="text-4xl text-blue-500 font-semibold text-center mb-6">{IsEditRole(pathname)
            ? "Edit"
            : "Create"}{" "} Role</p>
        </div>
          {/* <h1 className="text-2xl text-blue-500 font-semibold text-center mb-6">Create Role</h1> */}
          <div className="flex flex-col gap-y-6">
            {/* Role Name */}
            <div className="form-control flex flex-col">
              <label htmlFor="roleName" className="label mb-2">
                <span className="label-text text-[18px] sm:text-[20px] text-black">Role Name</span>
              </label>
              <Input
                type="text"
                id="roleName"
                placeholder="Enter role name"
                className="h-[40px] w-full rounded-[12px] text-black border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-500"
                value={roleName}
                onChange={onRoleName}
              />
              {roleError && (
                <span className="text-[12px] text-[#FF6D6D]">{roleError?.message}</span>
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
                className="h-[80px] w-full rounded-[12px] text-black border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-500"
                value={description}
                onChange={onDescription}
                required
              />
              {descriptionError && (
                <span className="text-[12px] text-[#FF6D6D]">{descriptionError?.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control flex justify-center mt-6">
              <Button
                type="button"
                className="h-[46px] min-w-[106px] rounded-[12px] bg-blue-500 text-base font-bold"
                onClick={async () => {
                  const validateRole = requireFeilds();
                  await handleCreateRole(validateRole[0]);
                }}
                disabled={loading}
              >
                {loading && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[white]/50 opacity-100">
                    <div className="loader"></div>
                  </div>
                )}
                Create Role
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
                {IsNewRole(pathname)
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
}
