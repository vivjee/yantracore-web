import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";
import { TvFrame } from "@/components/layout/TvFrame";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a YantraCore client account to start managing and tracking your requests.",
};

export default function SignupPage() {
  return (
    <TvFrame>
      <SignupForm inTv={true} />
    </TvFrame>
  );
}
