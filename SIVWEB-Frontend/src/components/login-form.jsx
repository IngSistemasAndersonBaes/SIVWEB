import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Package, Lock, Mail, Contrast } from "lucide-react";

export function LoginForm() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Detiene la recarga
    if (isLoading) return;

    setIsLoading(true);

    try {
      // 1) Obtener CSRF token
      const csrfRes = await fetch("http://localhost:3000/csrf-token", {
        credentials: "include",
      });

      if (!csrfRes.ok) throw new Error("No se pudo obtener CSRF token");
      const { csrfToken } = await csrfRes.json();

      // 2) Login con CSRF + cookies
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
        const message = await response.text().catch(() => "");
        throw new Error(message || "Error en la respuesta del servidor");
      }

      const data = await response.json().catch(() => null);
      alert("Datos enviados con éxito");
      console.log(data);
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
          Ingresa tus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="Usuario">Correo Electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="text"
                name="Usuario"
                placeholder="usuario@empresa.com"
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
                type="password"
                name="contraseña"
                placeholder="Ingresa tu contraseña"
                className="pl-10"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-600">
          ¿No tienes una cuenta?{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              console.log("Sign up clicked");
            }}
          >
            Solicitar acceso
          </a>
        </div>
        <div className="text-xs text-center text-gray-500">
          © 2026 Sistema de Inventario. Todos los derechos reservados.
        </div>
      </CardFooter>
    </Card>
  );
}