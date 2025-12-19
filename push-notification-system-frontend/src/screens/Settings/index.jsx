import {useState} from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { use } from 'react';
import { useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';


const Settings = () => {
  const axiosPrivate = useAxiosPrivate();
  const [inActiveDevicesList, setInactiveDevicesList] = useState([]);
  const [loadingInactiveDevices, setLoadingInactiveDevices] = useState(false);
  const [activeDevicesList, setActiveDevicesList] = useState([]);
  const [loadingActiveDevices, setLoadingActiveDevices] = useState(false);
  const [loadingActivateDevice, setLoadingActivateDevice] = useState(false);
  const [loadingDeleteDevice, setLoadingDeleteDevice] = useState(false);    


  const activateDevice = async (deviceId) => {
    try {
      setLoadingActivateDevice(true);
      const response = await axiosPrivate.post(`/api/devices/confirm_device/${deviceId}`);
      console.log("Device activated: ", response.data);
      // Optionally, refresh the inactive devices list after activation
    } catch (error) {
      console.error("Error activating device: ", error);
    } finally {
      setLoadingActivateDevice(false);
    }
  }

  const deleteDevice = async (deviceId) => {
    try {
      setLoadingDeleteDevice(true);
      //confirm deletion 
      const isConfirmed = window.confirm(
    "Are you sure you want to delete this item? This action cannot be undone."
  );
      if (isConfirmed) {
        const response = await axiosPrivate.delete(`/api/devices/test_device/${deviceId}`);
        console.log("Device deleted: ", response.data);
        // Optionally, refresh the active devices list after deletion
      }
    } catch (error) {
      console.error("Error deleting device: ", error);
    }
    finally {
      setLoadingDeleteDevice(false);
    }
  }
  useEffect(() => {
    let isMounted=true;
const abortController = new AbortController();
    // Fetch inactive devices from the backend API
    const fetchInactiveDevices = async () => {
      setLoadingInactiveDevices(true);
      try {
        const response = await axiosPrivate.get('/api/devices/inactive_test_devices', {
          signal: abortController.signal
        });
        console.log("Inactive Devices: ", response.data);
       
        // You can set this data to state if you want to display it in the table
        isMounted && setInactiveDevicesList(response.data);
      } catch (error) {
        console.error("Error fetching inactive devices: ", error);
      } finally {
        setLoadingInactiveDevices(false);
      }
    };

    fetchInactiveDevices();
    return ()=>{
      isMounted=false;
      abortController.abort();
    }
  }, [loadingActivateDevice]);


  useEffect(() => {
    let isMounted=true;
const abortController = new AbortController();
const fetchActiveDevice = async () => {
  try {
    setLoadingActiveDevices(true);
    const response = await axiosPrivate.get('/api/devices/test_devices',{
      signal: abortController.signal
    });
    console.log("Active Devices: ", response.data);
    // You can set this data to state if you want to display it in the table
    isMounted && setActiveDevicesList(response.data);
  } catch (error) {
    console.error("Error fetching active devices: ", error);
  } finally {
    isMounted && setLoadingActiveDevices(false);
  }
};

fetchActiveDevice();
return ()=>{
  isMounted=false;
  abortController.abort();
}
}, [loadingActivateDevice,loadingDeleteDevice]);
  return (
    <div style={{ padding: '20px' }}>
      <h1>Settings</h1>

      <h3>Inactive Devices</h3>
      {loadingInactiveDevices ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Device Type</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Create Time</TableCell>
                <TableCell>Actions</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {inActiveDevicesList.map((device) => (
                <TableRow key={device._id}>
                  <TableCell >{device.username}</TableCell>
                  <TableCell >{device.device_type}</TableCell>
                  <TableCell >{device.token}</TableCell>
                   <TableCell >{device?.createTime?new Date(device?.createTime):"N/A"}</TableCell>
                  <TableCell>
                    {/* Action buttons like Edit/Delete can go here */}
                    <button
                    onClick={() => activateDevice(device._id)}
                    >Activate</button>
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

       <h3>Active Devices</h3>
      {loadingActiveDevices ? (
        <p>Loading...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User Name</TableCell>
                <TableCell>Device Type</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Create Time</TableCell>
                <TableCell>Activate Time</TableCell>
                <TableCell>Actions</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {activeDevicesList.map((device) => (
                <TableRow key={device._id}>
                  <TableCell >{device.username}</TableCell>
                  <TableCell >{device.device_type}</TableCell>
                  <TableCell >{device.token}</TableCell>
                    <TableCell >{device?.createTime?new Date(device?.createTime):"N/A"}</TableCell>
                  <TableCell >{device?.activatedAt?new Date(device?.activatedAt):"N/A"}</TableCell>
                  <TableCell>
                    {/* Action buttons like Edit/Delete can go here */}
                    <button
                    onClick={() => deleteDevice(device._id)}
                    >delete</button>
                    
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Settings;
