import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { servicesList } from "@data/Servicios";
import { inputServiceConfig } from "@/config/serviceFormConfig";
import { Service } from "@/types/Service";
import UserInput from "@forms/UserInput";
import SaveButton from "@buttons/SaveButton";
import CreationButton from "@buttons/CreationButton";

interface ServiceFormProps {
  isEditMode: boolean;
  serviceId?: number;
}

type ServiceNew = {
  id: number;
  name: string;
  idProfessinoal: number;
  nameProfesional: string;
  description: string;
  price: number;
  durationMinutes: number;
  serviceType: string;
  active: string;
  creatingIn: string;
  updated_on: string;
};

export default function ServiceForm({
  isEditMode,
  serviceId,
}: ServiceFormProps) {
  //const [serviceData, setServiceData] = useState<ServiceData | null>(null);

  //Estas dos lineas son solo para pruebas
  const serviceData = servicesList.find((u) => u.id === serviceId);

  /*
  useEffect(() => {
    if (props.isEditMode && props.serviceId) {
      const fetchData = async () => {
        const response = await fetch(
          `/api-endpoint-not-yet/${props.serviceId}`
        );
        const data = await response.json();
        setServiceData(data);
      };
      fetchData();
    }
  }, [props.isEditMode, props.serviceId]);
  */

  const methods = useForm<ServiceNew>();

  useEffect(() => {
    if (isEditMode && serviceData) {
      methods.reset({
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
        durationMinutes: serviceData.durationMinutes,
        active: serviceData.active ? "Sí" : "No",
        serviceType: serviceData.serviceType,
      });
    } else {
      methods.reset({
        name: "",
        description: "",
        price: 0,
        durationMinutes: 0,
        active: "",
        serviceType: "",
      });
    }
  }, [isEditMode, serviceData, methods]);

  const list_inputs = inputServiceConfig.map((input) => (
    <UserInput
      label={input.label}
      key={input.key}
      type={input.type}
      id={input.key}
      validation={input.validation}
      options={input.options}
    />
  ));

  // TODO in a diff file
  const onClickSave = methods.handleSubmit((data) => {
    const transformedData: Service = {
      ...data,
      active: data.active === "Sí",
    };
    console.log(transformedData);
    alert(data);
    console.log(data);
  });

  const onClickCreate = methods.handleSubmit((data) => {
    alert(data);
    console.log(data);
  });

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
    </FormProvider>
  );
}
