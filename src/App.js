import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import {getAllOrders, updateItemPreparationStatus} from "./service";

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
        <label>{item.name} ---  Quantity:{item.quantity}</label>
      </div>
  );
};

const Order = ({ order, onPrepareItem, onOrderReady }) => {
  const handlePrepareItem = (itemId) => {
    onPrepareItem(itemId);
  };

  const handleOrderReady = () => {
    onOrderReady(order.id);
  };

  return (
      <div>
        <h2>Order #{order.id}</h2>
        <div>
          {order.items.map(item => (
              <OrderItem
                  key={item.id}
                  item={item}
                  onPrepare={handlePrepareItem}
              />
          ))}
        </div>
        <button onClick={handleOrderReady}>Mark as Ready</button>
      </div>
  );
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        const response = await getAllOrders();
        setOrders(response);
    }

    useEffect(() => {
      fetchOrders();
    }, []);

  const handlePrepareItem = (orderId, itemId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.id === itemId) {
              const newStatus = !item.isReady;
              updateItemPreparationStatus(item.id, newStatus)
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

  const handleOrderReady = (orderId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {

        return { ...order, isReady: true };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  return (
      <div>
        <h1>Orders</h1>
        {orders.map(order => (
            <Order
                key={order.id}
                order={order}
                onPrepareItem={(itemId) => handlePrepareItem(order.id, itemId)}
                onOrderReady={() => handleOrderReady(order.id)}
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
