import { Input, Button, Switch } from "@heroui/react";
import { useState, useEffect } from "react";
import {
  FaBuilding,
  FaAlignLeft,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import {
  AdminAgency,
  AgencyFormData,
} from "../interfaces/admin_agency.interface";

interface CreateAgencyFormProps {
  onSubmit: (data: AgencyFormData) => void;
  isLoading: boolean;
  initialData?: AdminAgency;
}

export const CreateAgencyForm = ({
  onSubmit,
  isLoading,
  initialData,
}: CreateAgencyFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [active, setActive] = useState(
    initialData?.active !== undefined ? initialData.active : true
  );
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setActive(initialData.active);
    } else {
      setName("");
      setDescription("");
      setActive(true);
    }
    setNameError("");
    setDescriptionError("");
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let isValid = true;

    setNameError("");
    setDescriptionError("");

    if (!name.trim()) {
      setNameError("El nombre de la agencia es obligatorio.");
      isValid = false;
    }

    if (!description.trim()) {
      setDescriptionError("La descripción de la agencia es obligatoria.");
      isValid = false;
    }

    if (!isValid) return;

    const formData: AgencyFormData = {
      name,
      description,
      active,
    };

    onSubmit(formData);
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nombre de la Agencia"
        labelPlacement="outside"
        placeholder="Introduce el nombre"
        value={name}
        onValueChange={setName}
        startContent={<FaBuilding className="text-slate-400" />}
        isInvalid={!!nameError}
        errorMessage={nameError}
        isDisabled={isLoading}
        isRequired
        classNames={{
          label: "text-slate-300",
          inputWrapper: "bg-slate-800 border-slate-700",
          input: "text-slate-100",
        }}
      />

      <Input
        label="Descripción"
        labelPlacement="outside"
        placeholder="Introduce una descripción"
        value={description}
        onValueChange={setDescription}
        startContent={<FaAlignLeft className="text-slate-400" />}
        isDisabled={isLoading}
        isRequired
        isInvalid={!!descriptionError}
        errorMessage={descriptionError}
        className="pt-5"
        classNames={{
          label: "text-slate-300",
          inputWrapper: "bg-slate-800 border-slate-700",
          input: "text-slate-100",
        }}
      />

      <div className="flex items-center gap-2 pt-2">
        <Switch
          isSelected={active}
          onValueChange={setActive}
          isDisabled={isLoading}
          thumbIcon={({ isSelected, className }) =>
            isSelected ? (
              <FaToggleOn className={className} />
            ) : (
              <FaToggleOff className={className} />
            )
          }
          classNames={{
            wrapper:
              "mr-2 bg-slate-700 group-data-[selected=true]:bg-green-600",
            label: "text-slate-300",
          }}
        >
          Activa
        </Switch>
        <span className="text-sm text-slate-400">
          {active ? "La agencia está activa" : "La agencia está inactiva"}
        </span>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          color="primary"
          isDisabled={!name || !description || isLoading}
          isLoading={isLoading}
          className="bg-sky-600 hover:bg-sky-700 text-white"
        >
          {isLoading
            ? isEditMode
              ? "Guardando..."
              : "Creando..."
            : isEditMode
            ? "Guardar Cambios"
            : "Crear Agencia"}
        </Button>
      </div>
    </form>
  );
};
