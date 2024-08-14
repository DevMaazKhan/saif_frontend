import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeOpenIcon, EyeClosedIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@/components/ui/use-toast";

const formSchema = yup.object().shape({
  username: yup.string().required("Username is a required field"),
  password: yup.string().required("Password is a required field"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const formMethods = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(formSchema),
  });

  const { toast } = useToast();

  function onLogin() {
    setLoading(true);

    const data = formMethods.getValues();

    if (data.username === "admin") {
      if (data.password === "admin") {
        setLoading(false);
        navigate("/dashboard", {
          replace: true,
        });
      } else {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Password is incorrect!",
        });
      }
    } else {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Username is incorrect!",
      });
    }
  }

  return (
    <div className="shadow-md max-w-[520px] p-10 rounded-md mx-auto mt-[30px]">
      <h2 className="text-primary font-bold text-4xl">Login</h2>
      <h2 className="text-primary/80 text-sm mb-6">Enter username and password to login</h2>
      <form onSubmit={formMethods.handleSubmit(onLogin)}>
        <div className="flex flex-col gap-3">
          <Controller
            control={formMethods.control}
            name="username"
            render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} placeholder="Username" className="bg-muted" autoFocus />}
          />
          <Controller
            control={formMethods.control}
            name="password"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                placeholder="Password"
                className="bg-muted"
                type={showPassword ? "text" : "password"}
                error={fieldState.error?.message || undefined}
                withIcon
                Icon={showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                onIconClick={() => {
                  setShowPassword((prev) => !prev);
                }}
              />
            )}
          />
        </div>
        <Button className="mt-3 w-full" btnClassNames="w-full" type="submit" onClick={onLogin} loading={loading} Icon={<ArrowRightIcon className="text-muted" />}>
          Login
        </Button>
      </form>
    </div>
  );
}

export { Login };
