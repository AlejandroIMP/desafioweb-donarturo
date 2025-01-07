import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserForm, updateUserSchema } from "@/schemas/user.schemas";
import { updateUsers } from "@/services/users.service";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { IUser } from "@/interfaces/auth.interface";
import { useState } from "react";

interface UserFormUpdateProps {
  usuario: IUser;
}

const UserFormUpdate = ({ usuario }: UserFormUpdateProps) => {
  const [valueState, setValueState] = useState(usuario.estados_idestados);
  const [valueRol, setValueRol] = useState(usuario.rol_idrol);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    mode: 'onChange',
    defaultValues: {
      rol_idrol: valueRol,
      estados_idestados: valueState,
      correo_electronico: usuario.correo_electronico,
      nombre_completo: usuario.nombre_completo,
      telefono: usuario.telefono,
      fecha_nacimiento: usuario.fecha_nacimiento,
      Clientes_idClientes: usuario.Clientes_idClientes || 0
    }
  });

  const onSubmit = async(data: UpdateUserForm) => {
    console.log(data);
    Number(data.rol_idrol);
    Number(data.estados_idestados);
    Number(data.Clientes_idClientes);
    try {
      console.log(data);
      await updateUsers(usuario.idusuarios, data);
      reset();
      location.reload();
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Idusuarios"
        type="number"
        fullWidth
        disabled={true}
        defaultValue={usuario.idusuarios}
      />
      <TextField
        label="Fecha de creacion"
        fullWidth
        disabled={true}
        defaultValue={usuario.fecha_creacion}
      />
      <Select
        {...register("rol_idrol")}
        label="Rol"
        fullWidth
        error={!!errors.rol_idrol}
        value={valueRol}
        onChange={(e) => setValueRol(Number(e.target.value))}
      >
        <MenuItem value="1">Operador</MenuItem>
        <MenuItem value="2">Usuario</MenuItem>
        <MenuItem value="3">Cliente</MenuItem>
      </Select>
      
      <Select
        {...register("estados_idestados")}
        label="Estado"
        fullWidth
        error={!!errors.estados_idestados}
        value={valueState}
        onChange={(e) => setValueState(Number(e.target.value))}
      >
        <MenuItem value="1">Activo</MenuItem>
        <MenuItem value="2">Inactivo</MenuItem>
      </Select>

      <TextField
        {...register("correo_electronico")}
        label="Correo electronico"
        fullWidth
        defaultValue={usuario.correo_electronico}
        error={!!errors.correo_electronico}
        helperText={errors.correo_electronico ? errors.correo_electronico.message : null}
      />
      <TextField
        {...register("nombre_completo")}
        label="Nombre completo"
        fullWidth
        defaultValue={usuario.nombre_completo}
        error={!!errors.nombre_completo}
        helperText={errors.nombre_completo ? errors.nombre_completo.message : null}
      />
      <TextField
        {...register("telefono")}
        label="Telefono"
        defaultValue={usuario.telefono}
        fullWidth
        error={!!errors.telefono}
        helperText={errors.telefono ? errors.telefono.message : null}
      />
      <TextField
        {...register("fecha_nacimiento")}
        label="Fecha de nacimiento"
        fullWidth
        defaultValue={usuario.fecha_nacimiento}
        error={!!errors.fecha_nacimiento}
        helperText={errors.fecha_nacimiento ? errors.fecha_nacimiento.message : null}
      />
      <TextField
        {...register("Clientes_idClientes")}
        label="Cliente"
        type="number"
        defaultValue={usuario.Clientes_idClientes}
        fullWidth
        error={!!errors.Clientes_idClientes}
        helperText={errors.Clientes_idClientes ? errors.Clientes_idClientes.message : null}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={Object.keys(errors).length > 0}
      >
        Actualizar
      </Button>
    </form>
  );
}

export default UserFormUpdate;
