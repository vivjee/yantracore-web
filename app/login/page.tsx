import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { TvFrame } from "@/components/layout/TvFrame";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your YantraCore account to access your dashboard, projects, and tools.",
};

export default function LoginPage() {
  return (
    <TvFrame>
      <LoginForm inTv={true} />
    </TvFrame>
  );
}
