import express from 'express';
import { 
  addCustomerAddress, 
  getCustomerAddresses, 
  updateCustomerAddress, 
  deleteCustomerAddress 
} from '../controller/AddressController';

export const AddressRouter = express.Router();
AddressRouter.post('/', addCustomerAddress);
AddressRouter.get('/:customer_id', getCustomerAddresses);
AddressRouter.put('/:address_id', updateCustomerAddress);
AddressRouter.delete('/:address_id', deleteCustomerAddress);
