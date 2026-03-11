import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointment Sent | ARC",
  description:
    "Your appointment has been sent to the clinic. A care coordinator will contact you to confirm details and verify insurance.",
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
