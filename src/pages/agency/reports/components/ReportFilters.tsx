import {
  RangeValue,
  CalendarDate,
  Card,
  CardBody,
  DateRangePicker,
  Input,
} from "@heroui/react";
import { FaHashtag } from "react-icons/fa";

export const ReportFilters = ({
  dateRange,
  onDateChange,
  hashtags,
  onHashtagChange,
}: {
  dateRange: RangeValue<CalendarDate> | null;
  onDateChange: (range: RangeValue<CalendarDate> | null) => void;
  hashtags: string;
  onHashtagChange: (value: string) => void;
}) => {
  return (
    <Card className="bg-slate-900/50 border border-slate-700 shadow-md mb-6">
      <CardBody className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <DateRangePicker
          label="Rango de Fechas del Reporte"
          labelPlacement="outside"
          value={dateRange}
          onChange={onDateChange}
          classNames={{
            base: "w-full",
            label: "text-slate-400 text-sm mb-1",
            inputWrapper:
              "bg-slate-800/50 border border-slate-700 h-10 focus-within:hover:bg-slate-800 hover:bg-slate-800",
            input: "text-slate-200 text-sm",
          }}
          popoverProps={{
            placement: "bottom",
            classNames: {
              base: "bg-slate-900 border border-slate-700 rounded-xl shadow-lg",
              content: "bg-slate-900 p-2",
            },
          }}
          calendarProps={{
            classNames: {
              base: "!bg-transparent",
              headerWrapper: "pt-2 pb-2 bg-slate-800/80",
              header: "text-slate-100 font-semibold",
              prevButton:
                "text-slate-400 hover:text-slate-100 border border-slate-700 rounded-md hover:bg-slate-700/50",
              nextButton:
                "text-slate-400 hover:text-slate-100 border border-slate-700 rounded-md hover:bg-slate-700/50",
              gridHeader: "bg-slate-800/80",
              gridHeaderCell: "text-xs text-slate-400 font-medium",
              gridBodyRow: "my-0.5",
              cell: ["w-9 h-9 text-sm rounded-lg", "outline-none"],
              cellButton: [
                "w-full h-full rounded-lg",
                "text-slate-300",
                "data-[hover=true]:bg-slate-700/50",
                "data-[unavailable=true]:text-slate-600 data-[unavailable=true]:line-through",
                "data-[disabled=true]:text-slate-600 data-[disabled=true]:opacity-50",
                "data-[outside-month=true]:text-slate-500 data-[outside-month=true]:opacity-80",
                "data-[selected=true]:bg-sky-500/10",

                // start (selected)
                "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:rounded-lg",
                "data-[selected=true]:data-[selection-start=true]:data-[range-selection=true]:bg-sky-500",
                // end (selected)
                "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:rounded-lg",
                "data-[selected=true]:data-[selection-end=true]:data-[range-selection=true]:bg-sky-500",
              ],
            },
          }}
        />
        <Input
          type="text"
          label="Filtrar por Hashtags"
          labelPlacement="outside"
          placeholder="#tendencia, #gaming, ..."
          value={hashtags}
          onValueChange={onHashtagChange}
          isDisabled={!dateRange}
          startContent={
            <FaHashtag className="text-slate-400 pointer-events-none flex-shrink-0" />
          }
          classNames={{
            label: "text-slate-400 text-sm mb-1",
            inputWrapper:
              "bg-slate-800/50 border border-slate-700 h-10 group-data-[focus=true]:border-sky-500 group-data-[focus=true]:bg-slate-800/50 data-[hover=true]:bg-slate-800",
            input: "text-slate-200 text-sm",
          }}
        />
      </CardBody>
    </Card>
  );
};
