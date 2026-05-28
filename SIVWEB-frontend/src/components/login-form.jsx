import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Package, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setStoredUser } from "../lib/auth";
import { Password } from 'primereact/password';
import { Eye, EyeOff } from "lucide-react";
        

export function LoginForm() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const csrfRes = await fetch("http://localhost:3000/csrf-token", {
        credentials: "include",
      });

      if (!csrfRes.ok) throw new Error("No se pudo obtener CSRF token");
      const { csrfToken } = await csrfRes.json();

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ usuario, contrasena }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message = errorPayload?.message || errorPayload?.error || "Error en la respuesta del servidor";
        throw new Error(message);
      }

      const data = await response.json().catch(() => null);
      if (data?.usuario) {
        setStoredUser(data.usuario);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Error de red", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-center mb-2">
          <div className="rounded-full bg-blue-600 p-3">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center">Sistema de Inventario</CardTitle>
        <CardDescription className="text-center">
          Ingresa tu usuario y contraseña para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usuario">Usuario</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="usuario"
                type="text"
                name="usuario"
                placeholder="Ej: admin o crod"
                className="pl-10"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Forgot password clicked");
                }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="contrasena"
                placeholder="Ingresa tu contraseña"
                className="pl-10 pr-10"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-600">
          Usa tu usuario del sistema, no el correo electronico.
        </div>
        <div className="text-xs text-center text-gray-500">
          © 2026 Sistema de Inventario. Todos los derechos reservados.
        </div>
      </CardFooter>
    </Card>
  );
}
