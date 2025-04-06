import {
  Card,
  CardBody,
  Avatar,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  FaUserCircle,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaEllipsisV,
  FaTrashAlt,
} from "react-icons/fa";
import { AffiliatedStreamer } from "../interfaces/affiliated_streamer.interface";

export const AffiliatedStreamerCard = ({
  streamer,
  onRemove,
}: {
  streamer: AffiliatedStreamer;
  onRemove: (id: string) => void;
}) => (
  <Card className="p-4 bg-slate-800/50 border border-slate-700">
    <CardBody className="flex flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Avatar
          src={streamer.imageUrl}
          icon={<FaUserCircle className="text-slate-400" />}
          size="md"
        />
        <span className="font-medium text-slate-200">{streamer.name}</span>
      </div>
      <div className="flex items-center gap-3 text-slate-400">
        {streamer.socialLinks?.instagram && <FaInstagram size={18} />}
        {streamer.socialLinks?.tiktok && <FaTiktok size={18} />}
        {streamer.socialLinks?.youtube && <FaYoutube size={18} />}
      </div>
      <Dropdown
        placement="bottom-end"
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg"
      >
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="text-slate-400 hover:text-slate-100"
          >
            <FaEllipsisV />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Streamer Actions"
          variant="flat"
          itemClasses={{
            base: "data-[hover=true]:bg-slate-700/50 rounded-lg",
            title: "font-medium text-sm text-slate-200",
          }}
        >
          <DropdownItem
            key="remove"
            color="danger"
            startContent={<FaTrashAlt size={14} />}
            onPress={() => onRemove(streamer.id)}
            className="text-red-400 data-[hover=true]:bg-red-600/20"
          >
            Remover de la agencia
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </CardBody>
  </Card>
);
