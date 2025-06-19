import React, { useState } from "react";
import { Button } from "./ui/button";
import { User2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/auth";
import { toast } from "sonner";
import RegisterForm from "./RegisterForm";

export default function LoginButton() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ phoneNumber: "", password: "" });
  const [errors, setErrors] = useState<{
    phoneNumber?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, session, signOut } = useAuth();
  const [registerOpen, setRegisterOpen] = useState(false);

  const validateForm = () => {
    const newErrors: { phoneNumber?: string; password?: string } = {};
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "El numero es requerido";
    }
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 4) {
      newErrors.password = "Mínimo 4 caracteres";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const { phoneNumber, password } = formData;
      const success = await signIn(phoneNumber, password);

      if (success) {
        setIsLoading(false);
        setOpen(false);
        setFormData({ phoneNumber: "", password: "" });
        setErrors({});
      } else {
        console.log({ success });
        toast.error("Contraseña o número incorrectos");
      }
    } catch (err) {
      toast.error("Error iniciando sesión");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ phoneNumber: "", password: "" });
    setErrors({});
  };

  const handleRegister = () => {
    setOpen(false);
    setRegisterOpen(!registerOpen);
  };

  return (
    <>
      <div className="absolute top-8 left-8 z-50">
        <Button
          className="flex items-center gap-2 text-white"
          onClick={() => setOpen(true)}
        >
          <User2 className="w-4 h-4 text-white" />
          {session?.user?.name || "Iniciar Sesión"}
        </Button>
      </div>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Iniciar Sesión</DialogTitle>
            <DialogDescription>
              Ingresa tus credenciales para acceder
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Phone</Label>
              <Input
                id="login-phone"
                type="text"
                placeholder="18298555555"
                value={session?.user.name || formData.phoneNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phoneNumber: e.target.value,
                  }))
                }
                className={errors.phoneNumber ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {!session?.user.name && errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Contraseña</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className={errors.password ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {!session?.user.name && errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            {!session?.user.name ? (
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Registrar
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? "Ingresando..." : "Iniciar Sesión"}
                </Button>
              </div>
            ) : (
              <Button onClick={() => signOut()} variant={"destructive"}>Logout</Button>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <RegisterForm onOpenChange={handleRegister} open={registerOpen} />
    </>
  );
}
