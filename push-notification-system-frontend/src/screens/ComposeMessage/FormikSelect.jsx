import React, { memo } from 'react';
import { useField } from 'formik';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  ListItemText,
  Chip,
  Autocomplete,
  TextField,
} from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

const FormikSelect = ({ label, options,multiple=true,loading=false , ...props}) => {
   console.log("props "+JSON.stringify(props))
   console.log("options "+JSON.stringify(options))

  const [field, meta, helpers] = useField(props);
// const {errors,touched }=form;
  const { name, value, onChange, onBlur} = field;
   const { error, touched } = meta;
  console.log(label+" field " + JSON.stringify(field))
   console.log(label+" touched error "+touched+" "+JSON.stringify(error))
   console.log(label+" meta "+JSON.stringify(meta))
   const handleChange = (event, value) => {
    console.log("value in handle change "+JSON.stringify(value))
    helpers.setValue(value?.value??value);
  };
  return (
    <FormControl fullWidth error={!!touched&& !!error} sx={{gridColumn:"span 2"}}>
     
      {/* <Select
      multiple={multiple??true}
      
        {...field} 
        {...props}
        value={field?.value??(multiple?[]:null) }
        label={label}
        // onBlur={() => setTouched(true)} // Mark as touched
        renderValue={(selected) => (
          <div>
            {multiple?selected.map((val) => (
              <Chip key={val} label={options.find(opt => opt.value === val)?.label} style={{ margin: 2 }} />
            )): <Chip key={selected} label={options.find(opt => opt.value === selected)?.label} style={{ margin: 2 }} />}
          </div>
        )}
        
      >
        {options?.map((option) =>
    {     
        return(
          <MenuItem key={option.value} value={option.value}>
            {multiple&&<Checkbox checked={field?.value?.includes(option.value)} />}
            <ListItemText primary={option.label} />
          </MenuItem>
        )})}
      </Select> */}

<Autocomplete
{...field} 
{...props}
loading={loading}
      multiple={multiple??true}
      options={options}
      onBlur={() => helpers.setTouched(true)} 
      // onBlur={onBlur}
      value={field?.value??(multiple?[]:null) }
      disableCloseOnSelect={multiple??true}
      // isOptionEqualToValue={(option, value) => option.value === value.value}
      renderOption={(props, option, { selected }) => {
        console.log("option in render option "+JSON.stringify(option))
        
        return(
        <li {...props} key={option?.value} >
          {/* <Checkbox
            icon={<CheckBoxOutlineBlank />}
            checkedIcon={<CheckBox />}
            checked={field?.value?.includes(option.value)}
          /> */}
        {multiple&&<Checkbox checked={field?.value?.some(obj => obj=== option)} color='font'/>}
          {option?.label??option?.value}
        </li>
      )}}
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
        {...params}
        label={label}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
      />
      )}

      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option?.label??option?.value  }
            {...getTagProps({ index })}
            key={option?.value}
          />
        ))
      }
    />
  




    
    </FormControl>
  );
};

export default memo(FormikSelect);