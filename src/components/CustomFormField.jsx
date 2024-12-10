import React, { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import Icon from "./Icon";
import { Eye, EyeOff } from "lucide-react";

export const FormFieldTypes = {
  INPUT: "input",
  TEXTAREA: "textarea",
  PHONE_INPUT: "phone_input",
  CHECKBOX: "checkbox",
  DATE_PICKER: "date_picker",
  SELECT: "select",
  SKELETON: "skeleton",
};

const RenderField = ({ field, props }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    field.onBlur(e);
  };

  switch (props.formFieldType) {
    case FormFieldTypes.INPUT:
      return (
        <div className="relative">
          {props.iconSrc && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Icon icon={props.iconSrc} className="text-bgPrimary" />
            </div>
          )}
          <FormControl>
            <div className="relative">
              <Input
                type={
                  props.type === "password" && !isPasswordVisible
                    ? "password"
                    : "text"
                }
                {...field}
                onFocus={handleFocus}
                onBlur={handleBlur}
                aria-label={props.placeholder}
                className={`
                  pl-10 pr-10 pt-6 pb-2 w-full
                  bg-transparent border-bgPrimary rounded-lg h-14
                  focus:ring-bgPrimary focus-visible:ring-0 peer
                `}
              />
              <label
                className={`
                  absolute left-10 top-1/2 -translate-y-1/2 transition-all duration-200 ease-out
                  pointer-events-none text-bgPrimary
                  text-[15px]
                  ${
                    isFocused || field.value
                      ? "top-3 text-xs text-bgPrimary"
                      : "text-base"
                  }
                `}
              >
                {props.placeholder}
              </label>
            </div>
          </FormControl>
          {props.type === "password" && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
            >
              {isPasswordVisible ? (
                <EyeOff className="text-gray-500" />
              ) : (
                <Eye className="text-gray-500" />
              )}
            </button>
          )}
        </div>
      );

    case FormFieldTypes.SELECT:
      return (
        <FormControl>
          <div className="relative">
            <select
              className="w-full bg-transparent border-bgPrimary h-14 focus:ring-0 rounded-lg pt-4"
              {...field}
              defaultValue={field.value || ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
              aria-label={props.placeholder}
            >
              <option value="" disabled hidden></option>
              {props.children}
            </select>
            <label
              className={`
                absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-200 ease-out
                pointer-events-none text-gray-500
                ${
                  isFocused || field.value
                    ? "top-3 text-xs text-facilityColorPrimary"
                    : "text-base"
                }
              `}
            >
              {props.placeholder}
            </label>
          </div>
        </FormControl>
      );

    default:
      return null;
  }
};

const CustomFormField = (props) => {
  const { control, formFieldType, label, name } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-1">
          <RenderField field={field} props={props} />
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
