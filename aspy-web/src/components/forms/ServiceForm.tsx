import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputServiceConfig } from "@/config/serviceFormConfig";
import { Service } from "src/types/Service";
import { useNavigate } from "react-router-dom";
import serviceAPI from "@API/serviceAPI";
import UserInput from "@forms/UserInput";
import SaveButton from "@buttons/SaveButton";
import CreationButton from "@buttons/CreationButton";
import Success from "@components/Success";
import Progress from "@components/Progress";
import { getService } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import { ServiceRequest } from "@/typesRequest/ServiceRequest";

interface ServiceFormProps {
  isEditMode: boolean;
  serviceId?: number;
}

export default function ServiceForm({
  isEditMode,
  serviceId,
}: ServiceFormProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { data, loading } = useRoleData();

  const handleClose = () => {
    navigate("/servicios");
    setOpen(false);
  };

  const methods = useForm<Service>();

  useEffect(() => {
    if (isEditMode && serviceId) {
      const service = getService(data, serviceId);
      if (service) {
        methods.reset({
          name: service.name,
          price: service.price,
        });
      }
    } else {
      methods.reset({
        name: "",
        price: 0,
      });
    }
  }, [isEditMode, serviceId]);

  const list_inputs = inputServiceConfig.map((input) => (
    <UserInput
      label={input.label}
      key={input.key}
      type={input.type}
      id={input.key}
      validation={input.validation}
    />
  ));

  // TODO in a diff file
  const onClickSave = methods.handleSubmit(async (data) => {
    try {
      if (isEditMode && serviceId) {
        const transformedData: Service = data;
        await serviceAPI.updateService(serviceId, transformedData.price);
        setMessage("¡Se ha actualizado con éxito!");
        setOpen(true);
      }
    } catch (error) {
      console.error("Error al guardar el servicio:", error);
    }
  });

  const onClickCreate = methods.handleSubmit(async (data) => {
    try {
      const transformedData: ServiceRequest = data;
      console.log(transformedData);
      await serviceAPI.createService(transformedData);
      setMessage("¡Se ha creado con éxito!");
      setOpen(true);
    } catch (error) {
      console.error("Error al guardar el servicio:", error);
    }
  });

  if (loading) return <Progress />;

  return (
    <FormProvider {...methods}>
      <form
        className="flex flex-col w-full h-full p-6"
        onSubmit={(e) => e.preventDefault()}
        noValidate
      >
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {list_inputs}
          </div>
        </div>
        <div className="gap-10 mt-4 flex flex-row items-center justify-center">
          {!isEditMode && (
            <CreationButton onClick={onClickCreate} text="Crear" />
          )}
          {isEditMode && <SaveButton onClick={onClickSave} text="Guardar" />}
        </div>
      </form>
      <Success
        open={open}
        handleClose={handleClose}
        isRegister={false}
        message={message}
      />
    </FormProvider>
  );
}
