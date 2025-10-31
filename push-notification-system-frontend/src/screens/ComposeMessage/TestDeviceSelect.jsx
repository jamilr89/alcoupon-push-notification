import { FormatAlignJustifyTwoTone } from '@mui/icons-material'
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Typography,CircularProgress } from '@mui/material'
import React from 'react'

const TestDeviceSelect = ({open,handleClose,testingDevicesList,checkedItems,setCheckedItems,handleSend,loadingTest}) => {
   console.log("testingDevicesList "+testingDevicesList)
   console.log("selected items "+JSON.stringify(checkedItems))
    const handleChange = (event) => {
      console.log ("checked items in test devices "+event.target.name)
      // console.log(JSON.stringify(
      //   ...checkedItems,
      //   item
      // ))
      setCheckedItems((items) => {
        if (event.target.checked) {
          // Add item (if not already present)
          return items.includes(event.target.name)?items:
           [...items, event.target.name];
        } else {
          // Remove item
          return items.filter((item) => item !== event.target.name);
        }
      });
        console.log("after set checked testing device "+JSON.stringify(checkedItems))
      };
  return (
    <Dialog open={open} onClose={handleClose}
    maxWidth="sm" 
        fullWidth  >
    <DialogTitle>Testers List</DialogTitle>
    <DialogContent>
      <Typography>Select items:</Typography>
      <FormGroup>
        {testingDevicesList?.map((device) => (
          <FormControlLabel
            device={device?.token}
            control={
              <Checkbox 
                checked={checkedItems.includes(device?.token)} 
                onChange={handleChange} 
                name={device?.token} 
              />
            }
            label={device?.username}
          />
        ))}
      </FormGroup>
    </DialogContent>
    
      {loadingTest?<CircularProgress color='grey' sx={{alignSelf:'end',margin:2}}/>:
      <DialogActions>
      <Button onClick={handleClose}>Close</Button>
      <Button onClick={handleSend}>Send</Button>
    </DialogActions>}
  </Dialog>
  )
}

export default TestDeviceSelect