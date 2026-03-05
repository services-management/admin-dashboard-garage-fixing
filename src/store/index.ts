import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import productReducer from './product/productSlice';
import categoryReducer from './category/categorySlice';
import serviceReducer from './service/serviceSlice';
import packageReducer from './package/packageSlice';
import vehicleReducer from './vehicle/vehicleSlice';
import staffReducer from './staff/staffSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    service: serviceReducer,
    package: packageReducer,
    vehicle: vehicleReducer,
    staff: staffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
