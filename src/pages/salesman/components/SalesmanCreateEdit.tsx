import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { useMutation } from "@tanstack/react-query";
import salesmanApi from "@/api/salesman.api";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { UploadIcon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "@/constants/menu";

const formDefaultValues = {
  nameFull: "",
  nameShort: "",
  email1: "",
  email2: "",
  email3: "",
  phone1: "",
  phone2: "",
  phone3: "",
  address: "",
};

const formSchema = yup.object().shape({
  nameFull: yup.string().required("Name Full is a required field"),
  nameShort: yup.string().optional(),
  email1: yup.string().optional(),
  email2: yup.string().optional(),
  email3: yup.string().optional(),
  phone1: yup.string().optional(),
  phone2: yup.string().optional(),
  phone3: yup.string().optional(),
  address: yup.string().optional(),
});

interface PageProps {
  menu: Menu;
}

const CompanyCreateEdit = (props: PageProps) => {
  const { menu } = props;
  const { toast } = useToast();
  const { startLoading, endLoading } = useLoadingContext();
  const { mutate } = useMutation({
    mutationFn: salesmanApi.create,
    onSettled: () => {
      endLoading();
      toast({
        title: "Salesman Created Successfully",
        className: "bg-green-400 text-white",
      });
      formMethods.reset(formDefaultValues);
      setTimeout(() => {
        formMethods.setFocus("nameFull");
      }, 100);
    },
  });

  const params = useParams();
  const partyID = useMemo(() => params.id, [params]);

  const navigate = useNavigate();

  const formMethods = useForm({
    defaultValues: formDefaultValues,
    resolver: yupResolver(formSchema),
  });

  const { mutate: getSingleSalesman } = useMutation({
    mutationFn: salesmanApi.getSingleSalesman,
    onSuccess: (data) => {
      formMethods.reset({
        nameFull: data?.responseData?.party?.nameFull,
        nameShort: data?.responseData?.party?.nameShort,
        email1: data?.responseData?.party?.email1 || "",
        email2: data?.responseData?.party?.email2 || "",
        email3: data?.responseData?.party?.email3 || "",
        phone1: data?.responseData?.party?.phone1 || "",
        phone2: data?.responseData?.party?.phone2 || "",
        phone3: data?.responseData?.party?.phone3 || "",
        address: data?.responseData?.party?.address || "",
      });
    },
  });

  const { mutate: updateSalesman } = useMutation({
    mutationFn: salesmanApi.update,
    onSettled: () => {
      endLoading();
      toast({
        title: "Salesman Updated Successfully",
        className: "bg-green-400 text-white",
      });
      navigate(-1);
    },
  });

  function onSubmit(data: any) {
    if (partyID) {
      startLoading("Updating Salesman");
      updateSalesman({ data, partyID });
    } else {
      startLoading("Creating Salesman");
      mutate(data);
    }
  }

  useEffect(() => {
    if (partyID) {
      getSingleSalesman(partyID);
    }
  }, [partyID]);

  return (
    <div className="p-2">
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <PageHeader
          menu={menu}
          actions={
            <Button icon={<UploadIcon className="text-white pointer-events-none" />} type="submit">
              Save
            </Button>
          }
        />

        <div className="flex flex-1 gap-2">
          <Controller
            name="nameFull"
            control={formMethods.control}
            render={({ field, fieldState }) => <Input {...field} className="w-[400px]" autoFocus error={fieldState.error?.message || undefined} placeholder="Salesman Name Full" />}
          />
        </div>
        <div className="flex flex-1 gap-2 mt-2">
          <Controller name="email1" control={formMethods.control} render={({ field }) => <Input {...field} className="w-[400px]" placeholder="Email 1" />} />
          <Controller name="email2" control={formMethods.control} render={({ field }) => <Input {...field} className="w-[300px]" placeholder="Email 2" />} />
          <Controller name="email3" control={formMethods.control} render={({ field }) => <Input {...field} className="w-[300px]" placeholder="Email 3" />} />
        </div>
        <div className="flex flex-1 gap-2 mt-2">
          <Controller name="phone1" control={formMethods.control} render={({ field }) => <Input {...field} className="w-[400px]" placeholder="Phone 1" />} />
          <Controller name="phone2" control={formMethods.control} render={({ field }) => <Input {...field} className="w-[300px]" placeholder="Phone 2" />} />
          <Controller name="phone3" control={formMethods.control} render={({ field }) => <Input {...field} className="w-[300px]" placeholder="Phone 3" />} />
        </div>
        <div className="flex flex-1 gap-2 mt-2">
          <Controller name="address" control={formMethods.control} render={({ field }) => <Input {...field} className="w-[400px]" placeholder="Address" />} />
        </div>
        <Button type="submit" className="hidden"></Button>
      </form>
    </div>
  );
};

export default CompanyCreateEdit;
