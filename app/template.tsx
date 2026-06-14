import { FloatingAssistant } from "@/components/assistant/FloatingAssistant";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FloatingAssistant />
    </>
  );
}
