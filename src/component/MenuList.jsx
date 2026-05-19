import { useContext, useEffect, useState } from "react"
import { OrdersContext } from "../context/ordersContext/OrdersContext";

export default function MenuList({ order, list }) {
    const { orderList, setOrderList } = useContext(OrdersContext);
    const [countdownTime, setTime] = useState(list.countdownTime);

    useEffect(() => {
        let interval = null;

        if (list.status === "Cook") {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [list.status, countdownTime]);

    function updateOrderStatus(newStatus){
        const updatedOrders = orderList.map((o) => {
            if (o.id === order.orderId) {
                return {
                    ...o,
                    orderList: o.orderList.map((li) => {
                        if (li.id === list.id) {
                            return { ...li, status: newStatus };
                        }
                        return li;
                    }),
                };
            }
            return o;
        });
        setOrderList(updatedOrders);
    }
    const countTimeHandler = () => {
        let nextStatus = list.status;
        if (list.status === "InKitchen") {
            nextStatus = "Cook";
        } else if (list.status === "Cook") {
            nextStatus = "finished";
        }

       updateOrderStatus(nextStatus);
    };

    const wantCancel=()=>((confirm("cancel this Menu")?updateOrderStatus("cancel"):console.log("NOchange")))
    const wantRedoMenu=()=>((confirm("redo this Menu")?updateOrderStatus("InKitchen"):console.log("NOchange")))

    return (
        <div className={` m-2 border rounded shadow-sm p-2 ${(list.status==="cancel")?"bg-red-500":"bg-gray-100"}`}>
            <div className="text-xs text-gray-500 font-bold">Order ID: {order.orderId}  recieved time:{list.orderTime.toLocaleString("th-TH")}</div>
            <div className={`p-2 rounded transition ${
                    (list.status != "finished")&&(list.status != "cancel") ? "bg-orange-100 hover:bg-orange-200 cursor-pointer" : "bg-gray-200 cursor-default"
                }`} 
                onClick={countTimeHandler}
            >
                <div className={"flex justify-between items-center "}>
                    <span>{list.id} : {list.name} (x{list.quantity})   </span>
                    
                    <span className={`font-mono text-[2vh] font-bold ${list.status==="Cook"?countdownTime < 10 ? "text-red-600" : "text-blue-600":"text-black"}`}>
                        {`${(list.status!="Cook")?"estimate cooking time ": "cooking time reamin "}`} :{countdownTime}s
                    </span>
                    
                    { (list.status!="finished"&&list.status!="cancel")?
                    <button className="bg-gray-500 text-amber-50 hover:bg-red-300 hover:text-black  cursor-pointer transition" onClick={(e)=>{e.stopPropagation();
                        wantCancel();}}>🗑️</button>:
                    <button className=" cursor-pointer" onClick={(e)=>{e.stopPropagation();
                        wantRedoMenu();}}>🔁</button>
                    }
                </div>
                <div className={`text-[5ph] font-bold uppercase mt-1 ${list.status==="Cook"?"text-red-600" : "text-blue-600"}`}>Status: {list.status}</div>
            </div>
        </div>
    );
}
