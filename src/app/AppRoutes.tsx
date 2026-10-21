import { Routes, Route } from 'react-router';
import { Home, Login, Register, Dashboard, Checkout, Payment } from '../pages';
import { CommonLayout } from './layouts/commonLayout';
import { AuthLayout } from './layouts/authLoyout';
import { ProtectedLayout } from './layouts/protectedLayout';


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<CommonLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}
