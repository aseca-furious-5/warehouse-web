import './App.css';
import { useEffect, useState } from "react";
import { getAllOrders, updateItemPreparationStatus, updateOrderStatus } from "./service";

const OrderItem = ({ item, onPrepare }) => {
    const handlePrepare = () => {
        onPrepare(item.id);
    };

    return (
        <div className="order-item">
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
    const statusOptions = ["PREPARING", "READY_TO_DISPATCH", "DISPATCHED"];
    const [currentStatusIndex, setCurrentStatusIndex] = useState(statusOptions.indexOf(order.status));

    const handlePrepareItem = (itemId) => {
        onPrepareItem(order.id, itemId);
    };

    const allItemsReady = () => {
        return order.items.every(item => item.isReady);
    };

    const handleChangeStatus = (event) => {
        const newStatusIndex = statusOptions.indexOf(event.target.value);
        if (newStatusIndex === currentStatusIndex ||
            (newStatusIndex === currentStatusIndex + 1 &&
                (currentStatusIndex !== 0 || allItemsReady()))) {
            setCurrentStatusIndex(newStatusIndex);
            onChangeStatus(order.id, event.target.value);
        }
    };

    return (
        <div className="order">
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
            <select onChange={handleChangeStatus} value={statusOptions[currentStatusIndex]}>
                {statusOptions.map((status, index) => (
                    <option key={status} value={status} disabled={index > currentStatusIndex + 1}>
                        {status}
                    </option>
                ))}
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
        <div className="App">
            <header className="App-header">
                <h1>Warehouse App</h1>
            </header>
            <OrdersPage />
        </div>
    );
}

export default App;
