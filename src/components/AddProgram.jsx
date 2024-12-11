/* eslint-disable no-unused-vars */
"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { useDirectorates } from "../Queries";
import Loading from "./Loader";
import { toast } from "react-toastify";
import { useAddProgram } from "../Mutations";


export default function AddProgram() {
  const { addProgram } = useAddProgram();
    const { directorates } = useDirectorates();
  const [open, setOpen] = useState(false);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

 
   const {
     control,
     handleSubmit,
     reset,
   } = useForm();

  const onSubmit = (data) => {
    setIsSubmitting(true);
    console.log("Form submitted with data:", data);
    addProgram(data, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Directorate added successfully!",
          status: "success",
        });
        reset();
        setOpen(false); 
        setTimeout(() => {
          setIsSubmitting(false);
        }, 300);

      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error?.message || "Something went wrong.",
          status: "error",
        });
      },
    });
  };

     const handleClose = () => {
       setOpen(false);
     };
  return (
    <>
      <div
        className="flex items-center gap-3 p-2 cursor-pointer hover:bg-accent transition-colors border border-teal-600 rounded-md mr-[70%]"
        onClick={() => setOpen(true)}
      >
        <div className="h-12 w-12 bg-teal-600 rounded-lg flex items-center justify-center">
          <Plus className="h-6 w-6 text-white" />
        </div>
        <span className="text-lg text-muted-foreground">Add New Programs</span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Program</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Program name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      className="h-10"
                      placeholder="Enter program name"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="directorate_id" className="text-sm font-medium">
                  Directorate
                </Label>
                <Controller
                  name="directorate_id"
                  control={control}
                  rules={{ required: "Directorate is required" }}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      required
                    >
                      <SelectTrigger id="directorate_id">
                        <SelectValue placeholder="Select Directorate" />
                      </SelectTrigger>
                      <SelectContent>
                        {directorates.map((directorate) => (
                          <SelectItem
                            key={directorate.id}
                            value={directorate.id}
                          >
                            {directorate.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="border-t p-4 bg-white mb-2">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="px-4 w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 px-4 w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loading size={30} /> : `Add Program`}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
