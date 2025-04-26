import { Avatar, Card, CardBody } from "@heroui/react";
import { FaBuilding } from "react-icons/fa";
import { Agency } from "../interface/agency.interface";

export const AffiliatedAgencyCard = ({ agency }: { agency: Agency }) => (
  <Card key={agency.id} className="p-3 bg-slate-800/50">
    <CardBody className="flex flex-row items-center gap-3">
      <Avatar
        src={agency.name}
        icon={<FaBuilding className="text-slate-400" />}
        size="md"
      />
      <span className="font-medium text-slate-200">{agency.name}</span>
    </CardBody>
  </Card>
);
