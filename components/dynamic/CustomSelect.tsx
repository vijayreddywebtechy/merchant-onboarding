"use client";

import { useId } from "react";
import Select, { 
  components, 
  DropdownIndicatorProps, 
  StylesConfig,
  SingleValue,
  MultiValue,
  ActionMeta
} from "react-select";
import Image from "next/image";
import icnSelectArrowP from "@/assets/images/icons/icn_select_arrow_p.png";

export interface SelectOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: SelectOption | SelectOption[] | null;
  onChange: (newValue: SingleValue<SelectOption> | MultiValue<SelectOption>, actionMeta: ActionMeta<SelectOption>) => void;
  placeholder?: string;
  transparentMenu?: boolean;
  className?: string;
  isMulti?: boolean;
}

const DropdownIndicator = (props: DropdownIndicatorProps<SelectOption, boolean>) => (
  <components.DropdownIndicator {...props}>
    <Image src={icnSelectArrowP} alt="" width={24} height={24} />
  </components.DropdownIndicator>
);

export default function CustomSelect({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  transparentMenu = true, 
  className = "",
  isMulti = false
}: CustomSelectProps) {
  const selectId = useId();
  
  const customStyles: StylesConfig<SelectOption, boolean> = {
    control: (base, state) => ({
      ...base,
      height: "48px",
      minHeight: "48px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#0062E1" : "#5C6C80",
      boxShadow: state.isFocused ? "none" : "none",
      fontSize: "16px",
      "@media (max-width: 768px)": {
        fontSize: "14px",
      },
      "&:hover": {
        borderColor: "#0062E1",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      height: "48px",
      minHeight: "48px",
      padding: "0 8px",
      display: "flex",
      alignItems: "center",
      flexWrap: "nowrap",
    }),

    singleValue: (base) => ({
      ...base,
      color: "#1A314D",
      fontSize: "16px",
      lineHeight: "1.5",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
      "@media (max-width: 768px)": {
        fontSize: "14px",
      },
    }),

    placeholder: (base) => ({
      ...base,
      color: "#5C6C80",
      fontSize: "16px",
      "@media (max-width: 768px)": {
        fontSize: "14px",
      },
    }),

    input: (base) => ({
      ...base,
      color: "#1A314D",
      fontSize: "16px",
      "@media (max-width: 768px)": {
        fontSize: "14px",
      },
    }),

    option: (base, state) => ({
      ...base,
      color: "#1A314D",
      fontSize: "15px",
      backgroundColor: state.isFocused ? "#f3f4f6" : "#ffffff",
      cursor: "pointer",
      padding: "8px 12px",
    }),

    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      backgroundColor: transparentMenu ? "transparent" : "white",
      overflow: "hidden",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    }),

    menuList: (base) => ({
      ...base,
      backgroundColor: transparentMenu ? "transparent" : "white",
      padding: 0,
    }),
  };

  return (
    <Select<SelectOption, boolean>
      instanceId={selectId}
      styles={customStyles}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full ${className}`}
      classNamePrefix="react-select"
      isMulti={isMulti}
      components={{
        DropdownIndicator,
        IndicatorSeparator: () => null,
      }}
    />
  );
}
