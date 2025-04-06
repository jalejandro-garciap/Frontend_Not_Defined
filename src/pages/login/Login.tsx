import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Card, CardBody, Button } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import { useEffect } from "react";

const Login = () => {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/redes-sociales");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  const handleGoogleLogin = async () => {
    try {
      loginWithGoogle();
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-foreground">
      <Card className="w-full max-w-md p-6 md:p-8 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl">
        <CardBody className="overflow-visible py-2 flex flex-col items-center">
          <h1 className="text-3xl font-semibold text-center text-slate-100 mb-3">
            Panel de Streamers
          </h1>
          <p className="text-center text-slate-400 mb-8 text-sm">
            Inicia sesión para generar tus reportes estadísticos.
          </p>

          <Button
            color="primary"
            variant="flat"
            onPress={handleGoogleLogin}
            startContent={<FcGoogle size={24} />}
            className="w-full font-medium text-base bg-sky-600/10 hover:bg-sky-600/20 text-sky-300 border border-sky-600/30"
            size="lg"
          >
            Iniciar sesión con Google
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
