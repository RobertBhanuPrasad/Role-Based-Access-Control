import Form from '@/components/FormField'
import React, { useState } from 'react'
import { useFormContext, useController } from 'react-hook-form'
import { Button } from '@/ui/button'

const CreateRolePage = () => {
  const onSubmit = (data: unknown) => {
    console.log("form data", data);
  };
  
  return (
    <div className="">
      <div>
        <Form onSubmit={onSubmit}>
            <CreatRolePage/>
        </Form>
      </div>
    </div>
  );
}

export default CreateRolePage;

export const CreatRolePage = () => {
  const [loading, setLoading] = useState(false);
  const { getValues } = useFormContext();
  const formData = getValues();
  
  // use controller for role name
  const {
    field: { value: roleName, onChange: onRoleName },
  } = useController({
    name: "roleName",
  });
  
  // use controller for role description
  const {
    field: { value: description, onChange: onDescription },
  } = useController({
    name: "description",
  });
  
  interface FormData {
    roleName: string;
    description: string;
  }

  const onSubmitForm = (formData: FormData) => {
    setLoading(true);
    console.log(formData, "form data");
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
              onClick={() => onSubmitForm(formData as FormData)}
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
    </main>
  );
}
