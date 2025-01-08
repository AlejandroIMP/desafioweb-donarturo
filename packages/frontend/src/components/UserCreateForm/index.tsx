import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserForm, createUserSchema } from "@/schemas/user.schemas";
import { createUser } from "@/services/users.service";
import { useState } from "react";
import { Button, TextField, Select, MenuItem } from "@mui/material";

const UserFormCreate = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [valueState, setValueState] = useState('');
  const [valueRol, setValueRol] = useState('');

  const togglePasswordVisibility = () => setShowPassword(!showPassword);


  const onSubmit = async (data: CreateUserForm) => {

    try {
      
      await createUser(data);

      reset();
      location.reload();
      
    } catch (error) {
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Select
        {...register("rol_idrol")}
        fullWidth
        label="Rol"
        error={!!errors.rol_idrol}
        value={valueRol}
        onChange={(e) => setValueRol(e.target.value)}
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
        value={valueState}
        onChange={(e) => setValueState(e.target.value)}
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
        type="tel"
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

      <Button
        variant="contained"
        color="primary"
        type="submit">Crear</Button>
    </form>
  );
}

export default UserFormCreate;
