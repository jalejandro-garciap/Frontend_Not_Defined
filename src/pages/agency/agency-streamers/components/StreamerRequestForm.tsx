import {
  Avatar,
  Textarea,
  Button,
  DateRangePicker,
  Tooltip,
  Link,
} from "@heroui/react";
import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaPaperPlane,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaCalendarAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { RequestFormData } from "../interfaces/request_form_data.interface";
import { SearchResultStreamer } from "../interfaces/search_result_streamer.interface";
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";

export const StreamerRequestForm = ({
  streamerToRequest,
  onSubmitRequest,
  onBack,
  isSubmitting = false,
}: {
  streamerToRequest: SearchResultStreamer;
  onSubmitRequest: (formData: RequestFormData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = useState<RequestFormData>({
    startDate: "",
    endDate: "",
    comment: "",
  });

  const [errors, setErrors] = useState<{
    dates?: string;
    budget?: string;
  }>({});

  useEffect(() => {
    setErrors({});
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: { dates?: string; budget?: string } = {};
    let isValid = true;

    if (!formData.startDate || !formData.endDate) {
      newErrors.dates = "Debes seleccionar un rango de fechas";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;
    onSubmitRequest(formData);
  };

  const todayDate = today(getLocalTimeZone());

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 py-4 px-5 bg-slate-600/60 rounded-2xl border border-slate-600">
        <div className="flex items-center gap-4">
          <Avatar
            src={streamerToRequest.imageUrl}
            size="lg"
            icon={<FaUserCircle />}
            isBordered
            color="primary"
          />
          <div>
            <p className="font-semibold text-xl text-primary-400">
              {streamerToRequest.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-200 ml-auto sm:ml-0">
          {streamerToRequest.socialUsernames?.instagram && (
            <Tooltip
              content={`Instagram: @${streamerToRequest.socialUsernames.instagram}`}
              className="bg-slate-800 border border-slate-700 text-slate-200"
            >
              <Link
                href={`https://instagram.com/${streamerToRequest.socialUsernames.instagram}`}
                isExternal
                isBlock
                aria-label="Instagram"
              >
                <FaInstagram
                  size={22}
                  className="text-[#E1306C] hover:scale-110 transition-transform"
                />
              </Link>
            </Tooltip>
          )}
          {streamerToRequest.socialUsernames?.tiktok && (
            <Tooltip
              content={`TikTok: @${streamerToRequest.socialUsernames.tiktok}`}
              className="bg-slate-800 border border-slate-700 text-slate-200"
            >
              <Link
                href={`https://tiktok.com/@${streamerToRequest.socialUsernames.tiktok}`}
                isExternal
                isBlock
                aria-label="TikTok"
              >
                <FaTiktok
                  size={22}
                  className="text-white hover:scale-110 transition-transform"
                />
              </Link>
            </Tooltip>
          )}
          {streamerToRequest.socialUsernames?.youtube && (
            <Tooltip
              content={`YouTube: ${streamerToRequest.socialUsernames.youtube}`}
              className="bg-slate-800 border border-slate-700 text-slate-200"
            >
              <Link
                href={`https://youtube.com/c/${streamerToRequest.socialUsernames.youtube}`}
                isExternal
                isBlock
                aria-label="YouTube"
              >
                <FaYoutube
                  size={22}
                  className="text-[#FF0000] hover:scale-110 transition-transform"
                />
              </Link>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-2 text-lg font-medium text-slate-200">
          <FaCalendarAlt className="text-primary-400" />
          <h3>Detalles de la colaboración</h3>
        </div>

        <DateRangePicker
          showMonthAndYearPickers
          label="Período de Colaboración"
          labelPlacement="outside"
          value={
            formData.startDate && formData.endDate
              ? {
                  start: parseDate(formData.startDate),
                  end: parseDate(formData.endDate),
                }
              : null
          }
          isRequired
          minValue={todayDate}
          isInvalid={!!errors.dates}
          errorMessage={errors.dates}
          onChange={(range) => {
            setFormData((prev) => ({
              ...prev,
              startDate: range?.start ? range.start.toString() : "",
              endDate: range?.end ? range.end.toString() : "",
            }));
          }}
          isDisabled={isSubmitting}
          classNames={{
            label: "text-slate-400",
            inputWrapper:
              "bg-slate-800/50 border border-slate-700 hover:bg-slate-800 focus-within:hover:bg-slate-800",
            input: "text-slate-200",
          }}
        />

        <Textarea
          label="Detalles de la Propuesta"
          labelPlacement="outside"
          placeholder="Describe tu idea de colaboración, requisitos específicos, objetivos, etc..."
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          classNames={{
            label: "text-slate-400",
            inputWrapper:
              "bg-slate-800/50 border border-slate-700 data-[hover=true]:bg-slate-800 group-data-[focus=true]:bg-slate-800",
            input: "text-slate-200 min-h-[120px]",
          }}
          isRequired
          isDisabled={isSubmitting}
          startContent={
            <Tooltip
              content="Sé específico para aumentar las probabilidades de aceptación"
              className="bg-slate-800 border border-slate-700 text-slate-200"
            >
              <FaInfoCircle className="text-slate-500 mr-2 self-start mt-2" />
            </Tooltip>
          }
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-700">
        <Button
          variant="flat"
          onPress={onBack}
          className="text-slate-300 bg-slate-700/50 hover:bg-slate-700"
          isDisabled={isSubmitting}
          fullWidth={false}
          size="lg"
        >
          Atrás
        </Button>
        <Button
          type="submit"
          color="primary"
          startContent={!isSubmitting && <FaPaperPlane size={14} />}
          className="bg-sky-600 hover:bg-sky-700 text-white"
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          fullWidth={false}
          size="lg"
        >
          {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
        </Button>
      </div>
    </form>
  );
};
