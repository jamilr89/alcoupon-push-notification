import React, { memo, useState, useEffect } from 'react';
import { useField } from 'formik';
import {
  FormControl,
  FormHelperText,
  Checkbox,
  Chip,
  Autocomplete,
  TextField,
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'; // Use the imported icon, not just CheckBoxOutlineBlank

const FormikSelect = ({ label, options, multiple = true, loading = false, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { name, onBlur, value } = field;
  const { error, touched } = meta;
  console.log('FormikSelect Props:', { name, value, options, multiple });

  // The Formik value (field.value) should be an array of primitive IDs (e.g., ['id1', 'id2'])

  const handleChange = (event, selectedOptions) => {
    let finalValue;

    if (multiple) {
      // 1. If multiple, map the array of selected option objects back to an array of their primitive values (IDs)
      finalValue = selectedOptions
      // ?.map(option => option.value);
    } else {
      // 2. If single, take the primitive value (ID) of the single selected option object
      finalValue = [selectedOptions];
      // ? selectedOptions.value : null;
    }
console.log('Handle Change:', { selectedOptions, finalValue });
    // Set the cleaned value (array of IDs or single ID) in Formik
    helpers.setValue(finalValue);
  };
  
  // No need for a separate checkboxHandleChange if using Autocomplete correctly
  // The Autocomplete's onChange handles the selection/deselection when clicking the option (or checkbox)

  // Autocomplete requires the 'value' prop to be an array of option objects, 
  // but Formik holds an array of primitive values (IDs). We must map the IDs back to objects for the Autocomplete to display them correctly.
  const autocompleteValue = multiple
    ? options.filter(option => field?.value?.find(obj => obj?.value === option?.value))
    : options.find(option => option?.value === field?.value?.value) || null;
console.log('FormikSelect Render:', { fieldValue: field.value, autocompleteValue });

  return (
    <FormControl fullWidth error={!!touched && !!error} sx={{ gridColumn: "span 2" }}>
      <Autocomplete
        {...props}
        loading={loading}
        multiple={multiple ?? true}
        options={options}
        value={autocompleteValue} 
        
        onBlur={() => helpers.setTouched(true)}
        disableCloseOnSelect={multiple ?? true}
        
       
        isOptionEqualToValue={(option, val) => {
          console.log('isOptionEqualToValue:', { option, val });
          return option.value == val.value}} 

        renderOption={(props, option, { selected }) => 
          {
            console.log('Render Option:', { option, selected ,fieldValue: field.value });

          return(<li {...props} key={option?.value}>
            {multiple &&
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
                color='text.primary'
                // The check logic must compare the option's value with the Formik value (array of IDs)
                checked={
                  field?.value?.find(obj => obj.value == option?.value)
                  ||selected}
              />
            }
            {option?.label ?? option?.value}
          </li>)}
        }
        
        onChange={handleChange}
        
        // This is necessary if your options are objects {label, value}
        getOptionLabel={(option) => option?.label || option?.value || ''}

        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
        
        // RenderValue receives the array of *option objects* for display
        renderValue={(value, getTagProps) =>{
          console.log('Render Value Called:', { value });
         return( value.map((option, index) => {
          console.log('Render Value:', { option, index });
            return <Chip
              label={option?.label ?? option?.value}
              {...getTagProps({ index })}
              key={option?.value}
            />
         }
          ))
        }
        }
      />
    </FormControl>
  );
};

export default memo(FormikSelect);