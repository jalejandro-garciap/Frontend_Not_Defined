import { Card, CardHeader, CardBody } from "@heroui/react";
import { FC } from "react";

interface AgencySectionProps {
  title: string;
  children: React.ReactNode;
}

export const AgencySection: FC<AgencySectionProps> = ({ title, children }) => (
  <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-700 shadow-lg w-full">
    <CardHeader className="px-4 py-3 border-b border-slate-700">
      <p className="text-md font-semibold text-slate-100">{title}</p>
    </CardHeader>
    <CardBody className="p-4">{children}</CardBody>
  </Card>
);
