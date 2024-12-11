/* eslint-disable no-unused-vars */
"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import Loading from "./Loader";
import { useAddDirectorate } from "../Mutations";
import { toast } from "react-toastify";

export default function AddDirectorate() {
  const { addDirectorate } = useAddDirectorate();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    setIsSubmitting(true);
    console.log("Form submitted with data:", data);
    addDirectorate(data, {
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
    reset();
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
        <span className="text-lg text-muted-foreground">
          Add New Directorates
        </span>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Directorate</DialogTitle>
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
                  rules={{ required: "Directorate name is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      className="h-10"
                      placeholder="Enter directorate name"
                    />
                  )}
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      className="h-10"
                      placeholder="Enter email"
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid phone number",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="phone"
                      className="h-10"
                      placeholder="Enter phone number"
                    />
                  )}
                />
              </div> */}
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
                    {isSubmitting ? <Loading size={30} /> : `Add Directorate`}
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
