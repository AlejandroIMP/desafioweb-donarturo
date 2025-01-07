import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSchemaCreateForm, userSchemaCreate } from "@/schemas/user.schemas";
import { createUser } from "@/services/users.service";
import { useState } from "react";
import { Button, TextField, Select, MenuItem } from "@mui/material";

const UserFormCreate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserSchemaCreateForm>({
    resolver: zodResolver(userSchemaCreate),
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);


  const onSubmit = async (data: UserSchemaCreateForm) => {
    try {
      await createUser(data);
      console.log(data);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <TextField
        {...register("fecha_creacion")}
        label="Fecha de creacion"
        fullWidth
        disabled={true}
        defaultValue={new Date().toISOString().slice(0, 10)}
        error={!!errors.fecha_creacion}
        helperText={errors.fecha_creacion ? errors.fecha_creacion.message : null}
      />
      <Select
        {...register("rol_idrol")}
        fullWidth
        label="Rol"
        error={!!errors.rol_idrol}
      >
        <MenuItem value={1}>Operador</MenuItem>
        <MenuItem value={2}>Usuario</MenuItem>
        <MenuItem value={3}>Cliente</MenuItem>
      </Select>
      <Select
        {...register("estados_idestados")}
        label="Estado"
        fullWidth
        error={!!errors.estados_idestados}
      >
        <MenuItem value={1}>Activo</MenuItem>
        <MenuItem value={2}>Inactivo</MenuItem>
      </Select>

      <TextField
        {...register("correo_electronico")}
        label="Correo electronico"
        fullWidth
        error={!!errors.correo_electronico}
        helperText={errors.correo_electronico ? errors.correo_electronico.message : null}
      />
      <TextField
        {...register("nombre_completo")}
        label="Nombre completo"
        fullWidth
        error={!!errors.nombre_completo}
        helperText={errors.nombre_completo ? errors.nombre_completo.message : null}
      />
      <div>
        <TextField
          {...register('user_password')}
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          placeholder="Password"
          autoComplete='current-password'
        />
        <Button
          type="button"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </Button>
      </div>
      <TextField
        {...register("telefono")}
        label="Telefono"
        fullWidth
        error={!!errors.telefono}
        helperText={errors.telefono ? errors.telefono.message : null}
      />
      <TextField
        {...register("fecha_nacimiento")}
        label="Fecha de nacimiento"
        fullWidth
        error={!!errors.fecha_nacimiento}
        helperText={errors.fecha_nacimiento ? errors.fecha_nacimiento.message : null}
      />
      <TextField
        {...register("Clientes_idClientes")}
        label="Cliente"
        type="number"
        fullWidth
        error={!!errors.Clientes_idClientes}
        helperText={errors.Clientes_idClientes ? errors.Clientes_idClientes.message : null}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit">Crear</Button>
    </form>
  );
}

export default UserFormCreate;
