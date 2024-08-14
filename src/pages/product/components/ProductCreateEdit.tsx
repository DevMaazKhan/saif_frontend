import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import productApi from "@/api/product.api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import companyApi from "@/api/company.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Menu } from "@/constants/menu";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { UploadIcon } from "@radix-ui/react-icons";
import { Combobox } from "@/components/ui/comboBox";

const formDefaultValues = {
  nameFull: "",
  nameShort: "",
  purchasePrice: "",
  salePrice: "",
  unitsInCarton: "",
  companyID: "",
};

const formSchema = yup.object().shape({
  nameFull: yup.string().required("Name Full is a required field"),
  nameShort: yup.string().optional(),
  purchasePrice: yup.string().required("Purchase Price is a required field"),
  salePrice: yup.string().required("Sale Price is a required field"),
  unitsInCarton: yup.string().required("Units in carton is a required field"),
  companyID: yup.string().required("Company is a required field"),
});

interface PageProps {
  menu: Menu;
}

const ProductCreateEdit = (props: PageProps) => {
  const { menu } = props;
  const { toast } = useToast();
  const { startLoading, endLoading } = useLoadingContext();

  const params = useParams();

  const productID = useMemo(() => params.id, [params]);

  const formMethods = useForm({
    defaultValues: formDefaultValues,
    resolver: yupResolver(formSchema),
  });

  const { data: companies } = useQuery(["companies"], companyApi.getAllCompanies);
  const { mutate: getSingleProduct } = useMutation({
    mutationFn: productApi.getSingleProduct,
    onSuccess: (data) => {
      formMethods.reset({
        nameFull: data?.responseData?.item?.nameFull,
        nameShort: data?.responseData?.item?.nameShort || "",
        purchasePrice: data?.responseData?.item?.purchasePrice,
        salePrice: data?.responseData?.item?.salePrice,
        unitsInCarton: data?.responseData?.item?.unitsInCarton,
        companyID: data?.responseData?.item?.companyID,
      });
    },
  });

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: productApi.create,
    onSettled: () => {
      endLoading();
      toast({
        title: "Product Created Successfully",
        className: "bg-green-400 text-white",
      });
      formMethods.reset(formDefaultValues);
      setTimeout(() => {
        formMethods.setFocus("nameFull");
      }, 100);
    },
  });
  const { mutate: updateProduct } = useMutation({
    mutationFn: productApi.update,
    onSettled: () => {
      endLoading();
      toast({
        title: "Product Updated Successfully",
        className: "bg-green-400 text-white",
      });
      navigate(-1);
    },
  });

  function onSubmit(data: any) {
    if (productID) {
      startLoading("Updating Product");
      updateProduct({ data, itemID: productID });
    } else {
      startLoading("Creating Product");
      mutate(data);
    }
  }

  useEffect(() => {
    if (productID) {
      getSingleProduct(productID);
    }
  }, [productID]);

  function onKeyDown(e: KeyboardEvent) {
    if (e.ctrlKey && e.key === "Enter") {
      formMethods.handleSubmit(onSubmit)();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="p-2">
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <PageHeader
          menu={menu}
          actions={
            <Button icon={<UploadIcon className="text-white" />} type="submit">
              Save
            </Button>
          }
        />
        <div className="flex flex-1 gap-2">
          <Controller
            name="nameFull"
            control={formMethods.control}
            render={({ field, fieldState }) => <Input {...field} className="w-[400px]" ref={field.ref} autoFocus error={fieldState.error?.message || undefined} placeholder="Product Name Full" />}
          />
        </div>
        <div className="flex flex-1 gap-2 mt-2">
          <Controller
            name="purchasePrice"
            control={formMethods.control}
            render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-[300px]" placeholder="Purchase Price" type="number" />}
          />
          <Controller
            name="salePrice"
            control={formMethods.control}
            render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-[300px]" placeholder="Sale Price" type="number" />}
          />
          <Controller
            name="unitsInCarton"
            control={formMethods.control}
            render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-[300px]" placeholder="Units in carton" type="number" />}
          />
        </div>
        <div className="flex flex-1 gap-2 mt-2 w-[300px]">
          <Controller
            name="companyID"
            control={formMethods.control}
            render={({ field, fieldState }) => (
              <Combobox
                label="Select Company"
                placeholder="Select Company"
                value={field.value}
                onChange={(value, option) => {
                  field.onChange(option.id);
                }}
                options={companies?.responseData.parties || []}
                labelKey="nameFull"
                valueKey="id"
                searchKey="nameFull"
                error={fieldState.error?.message || undefined}
              />
            )}
          />
        </div>
        <Button type="submit" className="hidden"></Button>
      </form>
    </div>
  );
};

export default ProductCreateEdit;
