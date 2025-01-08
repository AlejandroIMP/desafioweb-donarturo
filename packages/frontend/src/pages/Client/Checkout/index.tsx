import ClientLayout from "@/layouts/ClientLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrderSchema, OrderSchemaForm } from "@/schemas/order.schemas";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { OrderResponse } from "@/interfaces/orderAndDetails.interface";
import { postOrder } from "@/services/orders.service";
import { calculateDeliveryDate } from "@/utils/checkoutUtils";
import { CartProduct } from "@/interfaces/product.interface";
import { useClientContext } from "@/hooks";
import { formattedPrice } from "@/utils/orderUtils";


const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const { cartProducts, setCartProducts, setCount } = useClientContext();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<OrderSchemaForm>({
    resolver: zodResolver(OrderSchema),
    mode: "onChange",
  });


  const onSubmit = async (data: OrderSchemaForm) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const products = cartProducts.map((product: CartProduct) => ({
      idProductos: product.idProductos,
      cantidad: product.quantity,
      precio: (product.precio),
    }));

    console.log(products)

    data.fecha_entrega = calculateDeliveryDate();

    const newOrder: OrderSchemaForm = {
      estados_idestados: 3,
      nombre_completo: data.nombre_completo,
      direccion: data.direccion,
      telefono: data.telefono,
      correo_electronico: data.correo_electronico,
      fecha_entrega: data.fecha_entrega,
      Clientes_idClientes: 1,
      DetallesProductos: products,
    };

    console.log(newOrder)

    try {
      const response: OrderResponse = await postOrder(newOrder);

      if (response.success) {
        setSuccess(true);
        setIsLoading(false);

        reset();

        setCartProducts([]);
        setCount(0);

        setTimeout(() => {
          navigate(`/`);
          location.reload();
        }, 3000);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }


  };

  return (
    <ClientLayout>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          {...register("nombre_completo")}
          label="Nombre completo"
          variant="outlined"
          fullWidth
          error={!!errors.nombre_completo}
          helperText={errors.nombre_completo?.message}
        >
          Nombre Completo
        </TextField>
        <TextField
          {...register("direccion")}
          label="Dirección"
          variant="outlined"
          fullWidth
          error={!!errors.direccion}
          helperText={errors.direccion?.message}
        >
          Dirección
        </TextField>
        <TextField
          {...register("telefono")}
          label="Teléfono"
          variant="outlined"
          fullWidth
          error={!!errors.telefono}
          helperText={errors.telefono?.message}
        >
          Teléfono
        </TextField>
        <TextField
          {...register("correo_electronico")}
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          error={!!errors.correo_electronico}
          helperText={errors.correo_electronico?.message}
        >
          Correo electrónico
        </TextField>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isValid || isLoading}
        >
          Ir a pagar
        </Button>
        {
          isLoading && <p>Loading...</p>
        }
        {
          success === true &&
          <div>
            <p>Order placed successfully!</p>
            <p>Redirectin to your orders...</p>
          </div>
        }
      </form>
    </ClientLayout>
  );
}

export default Checkout;