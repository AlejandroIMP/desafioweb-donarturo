import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchemaUpdateForm, userSchemaUpdate } from "@/schemas/user.schemas";
import { updateUsers } from "@/services/users.service";
import { Button, TextField, Select, MenuItem } from "@mui/material";
import { IUser } from "@/interfaces/auth.interface";

interface UserFormUpdateProps {
  usuario: IUser;
}

const UserFormUpdate = ({ usuario }: UserFormUpdateProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserSchemaUpdateForm>({
    resolver: zodResolver(userSchemaUpdate),
  });

  const onSubmit =  (data: UserSchemaUpdateForm) => {
    Number(data.Clientes_idClientes);
    try {
      updateUsers(usuario.idusuarios, data);
      console.log(data);
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
        defaultValue={usuario.rol_idrol}
      >
        <MenuItem value={1}>Operador</MenuItem>
        <MenuItem value={2}>Usuario</MenuItem>
        <MenuItem value={3}>Cliente</MenuItem>
      </Select>
      <Select
        {...register("estados_idestados")}
        label="estados_idestados"
        fullWidth
        value={usuario.estados_idestados}
      >
        <MenuItem value={1}>Activo</MenuItem>
        <MenuItem value={2}>Inactivo</MenuItem>
      </Select>
      <TextField
        {...register("correo_electronico")}
        label="Correo electronico"
        fullWidth
        error={!!errors.correo_electronico}
        defaultValue={usuario.correo_electronico}
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
        {...register("user_password")}
        label="Contraseña"
        fullWidth
        defaultValue={usuario.user_password}
        error={!!errors.user_password}
        helperText={errors.user_password ? errors.user_password.message : null}
      />
      <TextField
        {...register("telefono")}
        label="Telefono"
        fullWidth
        value={usuario.telefono}
        error={!!errors.telefono}
        helperText={errors.telefono ? errors.telefono.message : null}
      />
      <TextField
        {...register("fecha_nacimiento")}
        label="Fecha de nacimiento"
        type="date"
        fullWidth
        defaultValue={usuario.fecha_nacimiento}
        error={!!errors.fecha_nacimiento}
        helperText={errors.fecha_nacimiento ? errors.fecha_nacimiento.message : null}
      />
      <TextField
        {...register("Clientes_idClientes")}
        label="Cliente"
        type="number"
        fullWidth
        defaultValue={usuario.Clientes_idClientes}
        error={!!errors.Clientes_idClientes}
        helperText={errors.Clientes_idClientes ? errors.Clientes_idClientes.message : null}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          alert('Usuario actualizado');

        }}
        type="submit"
        fullWidth
      >
        Actualizar
      </Button>
    </form>
  );
}

export default UserFormUpdate;
