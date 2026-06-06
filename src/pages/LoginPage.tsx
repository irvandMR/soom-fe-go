import AuthBanner from "@/components/features/auth/AuthBanner";
import FormLoginComponent from "@/components/features/auth/FormLoginComponent";

function LoginPage() {
  return (
    <div className="min-h-screen w-full flex">
      <AuthBanner className="hidden lg:flex w-[38%] min-h-screen" />
      <FormLoginComponent />
    </div>
  );
}

export default LoginPage;
