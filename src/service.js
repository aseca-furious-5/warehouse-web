import axios from "axios";
import {WAREHOUSE_API_URL} from "./constant";

export const getAllOrders = async () => {
    try{
        const response = await axios.get(`${WAREHOUSE_API_URL}/preparation/all`);
        return response.data;
    } catch (error){
        console.error("Error while fetching items", error);
    }
};

export const updateItemPreparationStatus = async (itemPreparationId, isReady) => {
    try {
        const readyPath = isReady ? "ready" : "not-ready";
        const response = await axios.put(
            `${WAREHOUSE_API_URL}/preparation/item/${itemPreparationId}/${readyPath}`
        );
        return response.data;
    } catch (error) {
        console.error("Error while preparing item", error);
    }
};

export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const response = await axios.put(
            `${WAREHOUSE_API_URL}/preparation/${orderId}/status`,
            { status: newStatus }
        );
        return response.data;
    } catch (error) {
        console.error("Error while preparing item", error);
    }
};