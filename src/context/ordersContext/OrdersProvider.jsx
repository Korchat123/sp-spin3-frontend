import { useState } from "react";
import { orders } from "../../assets/order";
import { OrdersContext } from "./OrdersContext";

export const OrdersProvider=({children})=>{
// Normalize initial data for compatibility across different components
const normalizedOrders = orders.map(o => ({
    ...o,
    id: o.id || o.orderId,
    orderId: o.orderId || o.id,
    orderList: o.orderList || o.List,
    List: o.List || o.orderList
}));

const [orderList,setOrderList]=useState(normalizedOrders);
const ordersListHandler=(e)=>{setOrderList(e)}

return(<OrdersContext.Provider value={{orderList,setOrderList,ordersListHandler}}>{children}</OrdersContext.Provider>)
}
