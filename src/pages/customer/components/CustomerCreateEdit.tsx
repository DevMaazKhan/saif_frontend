import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { useLoadingContext } from "@/contexts/LoadingContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import customerApi from "@/api/customer.api";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Menu } from "@/constants/menu";
import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { PlusIcon, UploadIcon } from "@radix-ui/react-icons";
import salesmanApi from "@/api/salesman.api";
import { Combobox } from "@/components/ui/comboBox";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import inventoryTransactionApi from "@/api/inventoryTransaction.api";

const formDefaultValues = {
  nameFull: "",
  nameShort: "",
  email1: "",
  email2: "",
  email3: "",
  phone1: "",
  phone2: "",
  phone3: "",
  areaName: "",
  salesmanID: "",
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
  areaName: yup.string().required("Customer Area Name is required"),
  salesmanID: yup.string().required("Salesman is required"),
});
const creditFormSchema = yup.object().shape({
  amount: yup.number().min(1).typeError("Amount is required").required("Amount is required"),
  message: yup.string().required("Message is required"),
});

interface PageProps {
  menu: Menu;
}

const CompanyCreateEdit = (props: PageProps) => {
  const { menu } = props;
  const { toast } = useToast();
  const { startLoading, endLoading } = useLoadingContext();
  const params = useParams();
  const partyID = useMemo(() => params.id, [params]);

  const [creditCustomerModal, setCreditCustomerModal] = useState(false);

  const formMethods = useForm({
    defaultValues: formDefaultValues,
    resolver: yupResolver(formSchema),
  });
  const creditFormMethod = useForm({
    defaultValues: {
      amount: NaN,
      message: "",
    },
    resolver: yupResolver(creditFormSchema),
  });

  const { data: salesman } = useQuery(["salesman"], salesmanApi.getAllSalesman);

  const navigate = useNavigate();

  const { mutate: getSingleCustomer } = useMutation({
    mutationFn: customerApi.getSingleCustomer,
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
        areaName: data?.responseData?.party?.area?.name,
        salesmanID: data?.responseData?.party?.salesmanID,
      });
      getCustomerAccountData({ customerID: partyID || "" });
    },
  });
  const { mutate: getCustomerAccountData, data: customerAccountData } = useMutation({
    mutationFn: inventoryTransactionApi.getCustomerAccountData,
  });
  const { mutate: customerAddCredit } = useMutation({
    mutationFn: inventoryTransactionApi.customerAddCredit,
    onSuccess: () => {
      getCustomerAccountData({ customerID: partyID || "" });
      setCreditCustomerModal(false);
      creditFormMethod.reset({
        amount: NaN,
        message: "",
      });
      endLoading();
      toast({
        title: "Customer Credited Successfully",
        className: "bg-green-400 text-white",
      });
    },
  });

  const { mutate } = useMutation({
    mutationFn: customerApi.create,
    onSettled: () => {
      endLoading();
      toast({
        title: "Customer Created Successfully",
        className: "bg-green-400 text-white",
      });
      formMethods.reset(formDefaultValues);
      setTimeout(() => {
        formMethods.setFocus("nameFull");
      }, 100);
    },
  });

  const { mutate: updateCustomer } = useMutation({
    mutationFn: customerApi.update,
    onSettled: () => {
      endLoading();
      toast({
        title: "Customer Updated Successfully",
        className: "bg-green-400 text-white",
      });
      navigate(-1);
    },
  });

  function onAddCredit(data: any) {
    startLoading("Adding Customer Credit");
    customerAddCredit({ amount: data.amount, customerID: partyID, message: data.message });
  }

  function onSubmit(data: any) {
    if (partyID) {
      startLoading("Updating Customer");
      updateCustomer({ data, partyID });
    } else {
      startLoading("Creating Customer");
      mutate(data);
    }
  }

  useEffect(() => {
    if (partyID) {
      getSingleCustomer(partyID);
    }
  }, [partyID]);

  const newCreditAmount = creditFormMethod.watch("amount");
  return (
    <>
      <Dialog open={creditCustomerModal} onOpenChange={setCreditCustomerModal}>
        <DialogContent>
          <DialogHeader>Add Customer Credit</DialogHeader>
          <form onSubmit={creditFormMethod.handleSubmit(onAddCredit)}>
            <div className="w-full">
              <div className="w-full flex flex-col">
                <span>
                  Customer Name: <b>{formMethods.getValues("nameFull")}</b>
                </span>
                <span>
                  Customer Credit: <b>{customerAccountData?.responseData.data?.totalCustomerCredit}</b>
                </span>
                <span>
                  New Credit Value: <b>{+customerAccountData?.responseData.data?.totalCustomerCredit + +(newCreditAmount || 0)}</b>
                </span>

                <div className="mt-4">
                  <Controller
                    name="amount"
                    control={creditFormMethod.control}
                    render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} autoFocus className="w-full" placeholder="Add Credit Amount" type="number" />}
                  />
                </div>
                <div className="mt-2">
                  <Controller
                    name="message"
                    control={creditFormMethod.control}
                    render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-full" placeholder="Enter Message" />}
                  />
                </div>

                <Button btnClassNames="w-full mt-4" type="submit">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className="p-2">
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <PageHeader
            menu={menu}
            actions={
              <div className="flex gap-2">
                {partyID && partyID !== "" && (
                  <Button
                    onClick={() => {
                      setCreditCustomerModal(true);
                    }}
                    icon={<PlusIcon className="text-white" />}
                    type="button"
                  >
                    Add Customer Credit
                  </Button>
                )}
                <Button icon={<UploadIcon className="text-white" />} type="submit">
                  Save
                </Button>
              </div>
            }
          />

          <div className="flex flex-1 gap-2">
            <Controller
              name="nameFull"
              control={formMethods.control}
              render={({ field, fieldState }) => <Input {...field} className="w-[400px]" ref={field.ref} autoFocus error={fieldState.error?.message || undefined} placeholder="Customer Name Full" />}
            />
            <Controller
              name="areaName"
              control={formMethods.control}
              render={({ field, fieldState }) => <Input {...field} error={fieldState.error?.message || undefined} className="w-[300px]" placeholder="Customer Area Name" />}
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
          <div className="flex flex-1 gap-2 mt-2 w-[300px]">
            <Controller
              name="salesmanID"
              control={formMethods.control}
              render={({ field, fieldState }) => (
                <Combobox
                  label="Select Salesman"
                  placeholder="Select Salesman"
                  value={field.value}
                  onChange={(value, option) => {
                    field.onChange(option.id);
                  }}
                  options={salesman?.responseData.parties || []}
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
    </>
  );
};

export default CompanyCreateEdit;
