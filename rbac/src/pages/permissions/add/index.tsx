import React, { useState } from 'react';
import Form from '@/components/FormField'
import { useFormContext, useController } from 'react-hook-form';
import { Button } from '@/components/ui/button';


const CreatePermissionPage = () => {
    const onSubmit = (data: unknown) => {
      console.log("form data", data);
    };
    
    return (
      <div className="">
        <div>
          <Form onSubmit={onSubmit}>
              <CreatPermissionPage/>
          </Form>
        </div>
      </div>
    );
}

export default CreatePermissionPage;

export const CreatPermissionPage = () => {
  const [loading, setLoading] = useState(false);
  const { getValues } = useFormContext();
  const formData = getValues();
  
  // Use controller for permission name
  const {
    field: { value: permissionName, onChange: onPermissionName },
  } = useController({
    name: "permissionName",
  });
  
  // Use controller for permission description
  const {
    field: { value: description, onChange: onDescription },
  } = useController({
    name: "description",
  });
  
  interface FormData {
    permissionName: string;
    description: string;
  }
  
  const onSubmitForm = (formData: FormData) => {
    setLoading(true);
    console.log(formData, "form data");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold text-center mb-6">Create Permission</h1>
        <div className="flex flex-col gap-y-6">
          
          {/* Permission Name */}
          <div className="form-control flex flex-col">
            <label htmlFor="permissionName" className="label mb-2">
              <span className="label-text text-[18px] sm:text-[20px] font-semibold">Permission Name</span>
            </label>
            <input
              type="text"
              id="permissionName"
              placeholder="Enter permission name"
              className="h-[40px] w-full rounded-[12px] border-[2px] border-gray-300 p-1 pl-[15px] outline-none focus:border-blue-700"
              value={permissionName}
              onChange={onPermissionName}
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
              Create Permission
            </Button>
          </div>
        </div>
      </div>
    </main>        
  );
};

