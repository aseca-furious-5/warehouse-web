import './App.css';
import {useEffect, useState} from "react";
import {getAllOrders, updateItemPreparationStatus, updateOrderStatus} from "./service";


const OrderItem = ({ item, onPrepare }) => {
    const handlePrepare = () => {
        onPrepare(item.id);
    };

    return (
        <div>
            <input
                type="checkbox"
                checked={item.isReady}
                onChange={handlePrepare}
            />
            <label>{item.name} --- Quantity: {item.quantity}</label>
        </div>
    );
};

const Order = ({ order, onPrepareItem, onChangeStatus }) => {
    const handlePrepareItem = (itemId) => {
        onPrepareItem(order.id, itemId);
    };

    const handleChangeStatus = (event) => {
        onChangeStatus(order.id, event.target.value);
    };

    return (
        <div>
            <h2>Preparation #{order.id}</h2>
            <h3>Order ID: {order.orderId}</h3>
            <div>
                {order.items.map(item => (
                    <OrderItem
                        key={item.id}
                        item={item}
                        onPrepare={handlePrepareItem}
                    />
                ))}
            </div>
            <select onChange={handleChangeStatus} value={order.status}>
                <option value="PREPARING">Preparing</option>
                <option value="READY_TO_DISPATCH">Ready to dispatch</option>
                <option value="DISPATCHED">Dispatched</option>
            </select>
        </div>
    );
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const response = await getAllOrders();
        setOrders(response);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handlePrepareItem = (orderId, itemId) => {
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                const updatedItems = order.items.map(item => {
                    if (item.id === itemId) {
                        const newStatus = !item.isReady;
                        updateItemPreparationStatus(item.id, newStatus);
                        return { ...item, isReady: newStatus };
                    }
                    return item;
                });
                return { ...order, items: updatedItems };
            }
            return order;
        });
        setOrders(updatedOrders);
    };

    const handleChangeStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
                updateOrderStatus(order.id, newStatus);
                return { ...order, status: newStatus };
            }
            return order;
        });
        setOrders(updatedOrders);
    };

    return (
        !orders || orders.length === 0 ?
            <div>Loading...</div> :
            <div>
                <h1>Orders</h1>
                {orders.map(order => (
                    <Order
                        key={order.id}
                        order={order}
                        onPrepareItem={handlePrepareItem}
                        onChangeStatus={handleChangeStatus}
                    />
                ))}
            </div>
    );
};


function App() {
    return (
        <OrdersPage/>
    );
}

export default App;
