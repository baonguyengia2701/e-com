import AccountForm from "./AccountForm";
import PassWordForm from "./PasswordForm";

export default function MyAccount() {
  return (
    <div className="flex flex-col gap-14 xl:my-0 my-10">
      <AccountForm />
      <PassWordForm />
    </div>
  );
}
