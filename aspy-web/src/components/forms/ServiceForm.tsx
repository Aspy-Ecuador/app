// FINAL
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { inputServiceConfig } from "@/config/serviceFormConfig";
import type { Service } from "@/typesResponse/Service";
import { useNavigate } from "react-router-dom";
import serviceAPI from "@API/serviceAPI";
import UserInput from "@forms/UserInput";
import Success from "@components/Success";
import Progress from "@components/Progress";
import { getService } from "@/utils/utils";
import { useRoleData } from "@/observer/RoleDataContext";
import type { ServiceRequest } from "@/typesRequest/ServiceRequest";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

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
  const [loadingSave, setLoadingSave] = useState(false);
  const [isError, setIsError] = useState(false);
  const [fail, setFail] = useState(false);
  const { data, loading, refreshServices } = useRoleData();

  const methods = useForm<Service>();

  const handleClose = () => {
    setOpen(false);
    if (!isError) navigate("/servicios");
  };

  useEffect(() => {
    if (isEditMode && serviceId) {
      const service = getService(data, serviceId);
      if (service) {
        methods.reset({ name: service.name, price: Number(service.price) });
      }
    } else {
      methods.reset({ name: "", price: 0 });
    }
  }, [isEditMode, serviceId, data, methods]);

  const list_inputs = inputServiceConfig.map((input) => (
    <Box key={input.key} sx={{ minWidth: 0, width: "100%" }}>
      <UserInput
        label={input.label}
        type={input.type}
        id={input.key}
        validation={input.validation}
      />
    </Box>
  ));

  const onClickSave = methods.handleSubmit(async (formData) => {
    try {
      setLoadingSave(true);
      const dataService: ServiceRequest = {
        ...formData,
        price: Number(formData.price),
      };
      await serviceAPI.updateService(serviceId!, dataService);
      await refreshServices();
      setMessage("¡Servicio actualizado con éxito!");
      setIsError(false);
      setFail(false);
      setOpen(true);
    } catch (error) {
      console.error("Error al guardar el servicio:", error);
      setFail(true);
      setMessage("Ocurrió un error al guardar el servicio.");
      setIsError(true);
      setOpen(true);
    } finally {
      setLoadingSave(false);
    }
  });

  const onClickCreate = methods.handleSubmit(async (formData) => {
    try {
      setLoadingSave(true);
      const dataService: ServiceRequest = {
        ...formData,
        price: Number(formData.price),
      };
      await serviceAPI.createService(dataService);
      await refreshServices();
      setMessage("¡Servicio creado con éxito!");
      setIsError(false);
      setFail(false);
      setOpen(true);
    } catch (error) {
      console.error("Error al crear el servicio:", error);
      setFail(true);
      setMessage("Ocurrió un error al crear el servicio.");
      setIsError(true);
      setOpen(true);
    } finally {
      setLoadingSave(false);
    }
  });

  if (loading) return <Progress />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        {/* Grid de inputs */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            mb: 4,
            "& > *": { minWidth: 0 },
          }}
        >
          {list_inputs}
        </Box>

        {/* Botón de acción */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          {isEditMode ? (
            <Button
              onClick={onClickSave}
              disabled={loadingSave}
              startIcon={
                loadingSave ? undefined : <SaveRoundedIcon fontSize="small" />
              }
              sx={{
                minWidth: 140,
                minHeight: 36,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                px: 3,
                background: "linear-gradient(135deg, #1565C0 0%, #1976D2 100%)",
                color: "#fff",
                boxShadow: "0 4px 14px rgba(25,118,210,0.3)",
                "&:hover": { boxShadow: "0 6px 20px rgba(25,118,210,0.4)" },
                "&:disabled": {
                  background: "rgba(0,0,0,0.12)",
                  boxShadow: "none",
                },
              }}
            >
              {loadingSave ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Guardar"
              )}
            </Button>
          ) : (
            <Button
              onClick={onClickCreate}
              disabled={loadingSave}
              startIcon={
                loadingSave ? undefined : <AddRoundedIcon fontSize="small" />
              }
              sx={{
                minWidth: 140,
                minHeight: 36,
                borderRadius: 2.5,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.9rem",
                px: 3,
                background: "linear-gradient(135deg, #0F6E56 0%, #1B8C6E 100%)",
                color: "#fff",
                boxShadow: "0 4px 14px rgba(15,110,86,0.3)",
                "&:hover": { boxShadow: "0 6px 20px rgba(15,110,86,0.4)" },
                "&:disabled": {
                  background: "rgba(0,0,0,0.12)",
                  boxShadow: "none",
                },
              }}
            >
              {loadingSave ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Crear"
              )}
            </Button>
          )}
        </Box>
      </form>

      <Success
        open={open}
        handleClose={handleClose}
        isRegister={false}
        message={message}
        fail={fail}
      />
    </FormProvider>
  );
}
