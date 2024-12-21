"use client";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import Spin from "@/components/ui/Spin";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  PHONE_NUMBER_REQUIRED_MESSAGE,
  PHONE_NUMBER_INVALID_MESSAGE,
  FIRST_NAME_REQUIRED_MESSAGE,
  LAST_NAME_REQUIRED_MESSAGE,
} from "@/constants/validate";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import { REGEX_PHONE_NUMBER } from "@/constants";
import { uploadImage, updateUserInfo, getUser } from "@/apis/profile";
import { successToast } from "@/utils/toast";

interface IAccountData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imgUrl?: string;
}

const schema = yup.object({
  firstName: yup.string().required(FIRST_NAME_REQUIRED_MESSAGE),
  lastName: yup.string().required(LAST_NAME_REQUIRED_MESSAGE),
  email: yup
    .string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
  phone: yup
    .string()
    .matches(REGEX_PHONE_NUMBER, PHONE_NUMBER_INVALID_MESSAGE)
    .required(PHONE_NUMBER_REQUIRED_MESSAGE),
  imgUrl: yup.string(),
});

const AccountForm = () => {
  const methods = useForm<IAccountData>({
    resolver: yupResolver(schema),
  });
  const { setValue, getValues, handleSubmit, reset } = methods;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await getUser();
        const { firstName, lastName, email, imgUrl, phone } = response?.data;
        reset({
          firstName,
          lastName,
          email,
          imgUrl,
          phone,
        });
      } catch (error: any) {
        setMessage(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const response = await uploadImage(file);
      setValue("imgUrl", response.data.path);
    } catch (error: any) {
      setMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: IAccountData) => {
    setIsLoading(true);
    try {
      await updateUserInfo(data);
      successToast("Cập nhật thành công");
    } catch (error: any) {
      setMessage(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="shadow-lg border border-dark-200 rounded-lg">
      <h1 className="text-xl border-b border-b-dark-200 p-4 font-medium">
        Thông tin tài khoản
      </h1>

      <Spin
        isLoading={isLoading}
        className="text-dark-300 fill-blue-800 rounded-lg"
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4">
            <div className="flex gap-10 justify-between items-center">
              <div className="w-1/2 flex flex-col gap-6">
                <Input label="Họ đệm" name="firstName" />
                <Input label="Tên" name="lastName" />
                <Input
                  label="Email"
                  name="email"
                  placeholder="Nhập email mới"
                />
                <Input
                  label="Số điện thoại"
                  name="phone"
                  placeholder="Nhập số điện thoại mới"
                />
              </div>

              <div className="flex flex-col gap-6 items-center w-1/2">
                <div className="w-48 h-48 rounded-full overflow-hidden">
                  <Image
                    src={getValues("imgUrl") ?? "/images/avatar.png"}
                    alt="Avatar"
                    width={228}
                    height={228}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div>
                  <Input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label
                    htmlFor="avatar"
                    className="inline-block text-center cursor-pointer px-4 py-2 text-primary rounded-md border border-primary hover:bg-primary hover:text-white w-40"
                  >
                    Chọn ảnh
                  </label>
                </div>
              </div>
            </div>

            {message && <div className="text-red-300 my-2">{message}</div>}
            <Button
              type="submit"
              className="w-44 font-normal mt-6"
              disabled={isLoading}
            >
              Lưu thay đổi
            </Button>
          </form>
        </FormProvider>
      </Spin>
    </div>
  );
};

export default AccountForm;
