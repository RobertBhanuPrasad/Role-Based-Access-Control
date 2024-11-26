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
import { useRouter } from "next/router";
import { usePathname } from 'next/navigation'
import { CreateRoleSchema } from '@/components/roles/RolesValidations'


const index = (): JSX.Element => {
  return <CreateRole/>
}
export default index; 

export const CreateRole = () => {
  const onSubmit = (data: unknown) => {
    console.log("form data", data);
  };
  
  return (
    <div className="">
      <div>
        <Form onSubmit={onSubmit}
        schema={CreateRoleSchema}>
            <CreatRolePage/>
        </Form>
      </div>
    </div>
  );
}


export const CreatRolePage = () => {
  const [loading, setLoading] = useState(false);
  const [statusUpdationDialogOpen, setStatusUpdationDialogOpen] =
    useState(false);
  const { watch } = useFormContext();
  const router = useRouter();
  const pathname = usePathname();
  const formData = watch();
  console.log(formData, "formdataroles")
  // use controller for role name 
  const {
    field: { value: roleName, onChange: onRoleName },
  } = useController({
    name: RolesFormNames?.role_name,
  });
  
  // use controller for role description
  const {
    field: { value: description, onChange: onDescription },
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
      router.replace("/courses/discount-code/list");
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


  const handleCreateRole = async () => {
    setLoading(true)
    await handleSubmitRoleDetails(formData)
    setStatusUpdationDialogOpen(true);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Create Role</h1>
        <div className="flex flex-col gap-y-6">
          {/* Role Name */}
          <div className="form-control flex flex-col">
            <label htmlFor="roleName" className="label mb-2">
              <span className="label-text text-[18px] sm:text-[20px] font-semibold">Role Name</span>
            </label>
            <input
              type="text"
              id="roleName"
              placeholder="Enter role name"
              className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
              value={roleName}
              onChange={onRoleName}
            />
          </div>

          {/* Description */}
          <div className="form-control flex flex-col">
            <label htmlFor="description" className="label mb-2">
              <span className="label-text text-[18px] sm:text-[20px] font-semibold">Description</span>
            </label>
            <textarea
              id="description"
              placeholder="Enter description"
              className="h-[80px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
              value={description}
              onChange={onDescription}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="form-control flex justify-center mt-6">
            <Button
              type="button"
              className="h-[46px] min-w-[106px] rounded-[12px] bg-[#7677F4] text-base font-bold"
              onClick={() => handleCreateRole()}
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
                  {IsNewRole(pathname) 
                    ? "Your new Role has been successfully created"
                    : "Your Role has been successfully updated"}
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
                      {copiedRoleCode ? (
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
              {IsNewRole(pathname) ? (
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
                    Go to Find Roles Page
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </main>
  );
}
