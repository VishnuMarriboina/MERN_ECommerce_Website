import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  placeOrder, fetchMyOrders, fetchAllOrders,
  updateOrderStatus, CancelOrder,
} from "./order.thunk";

export function useOrder() {
  const dispatch = useDispatch();
  const { orders, allOrders, loading, error, successMessage } = useSelector((s) => s.order);

  const place = useCallback((orderData) => dispatch(placeOrder(orderData)), [dispatch]);
  const loadMyOrders = useCallback(() => dispatch(fetchMyOrders()), [dispatch]);
  const loadAllOrders = useCallback(() => dispatch(fetchAllOrders()), [dispatch]);
  const updateStatus = useCallback((payload) => dispatch(updateOrderStatus(payload)), [dispatch]);
  const cancel = useCallback((orderId) => dispatch(CancelOrder(orderId)), [dispatch]);

  return {
    orders, allOrders, loading, error, successMessage,
    place, loadMyOrders, loadAllOrders, updateStatus, cancel,
  };
}
