import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast"

const BASE_URL = "http://localhost:3000/api/products";

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,
    currentProduct: null,

    formData: {
        name: "",
        price: "",
        image: ""
    },

    setFormData: (formData) => set({ formData }),

    resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

    fetchProducts: async () => {
        set({ loading: true })
        try {
            const response = await axios.get(`${BASE_URL}`);
            set({ products: response.data.data, error: null });
        } catch (error) {
            console.log("Error Fetching Products", error);
            if (error.status == 429) set({ error: "Rate Limit Exceeded", products: [] });
            else set({ error: "Something went Wrong", products: [] });
        } finally {
            set({ loading: false })
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true })
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            set((prev) => ({ products: prev.products.filter((product) => product.id !== id) }))
            toast.success("Product Deleted Successfully")
        } catch (error) {
            console.log("Error Deleting the Product", error);
            toast.error("Something went Wrong")
        } finally {
            set({ loading: false })
        }

    },

    addProduct: async (e) => {
        if (e?.preventDefault) e.preventDefault();
        set({ loading: true })
        try {
            const { formData } = get();
            await axios.post(`${BASE_URL}`, formData);
            await get().fetchProducts();
            get.resetForm();
            toast.success("Product added Successfully");
            document.getElementById("add_product_modal").close();
        } catch (error) {
            console.log("Error in add Product function", error);
            toast.error("Something went wrong");
        } finally {
            set({ loading: false })
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            set({
                currentProduct: response.data.data,
                formData: response.data.data,
                error: null,
            });
        } catch (error) {
            console.log("Error in fetchProduct function", error);
            set({ error: "Something went wrong", currentProduct: null });
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (id) => {
        set({ loading: true });
        try {
            const { formData } = get();
            const response = await axios.put(`${BASE_URL}/${id}`, formData);
            set({ currentProduct: response.data.data });
            toast.success("Product updated successfully");
        } catch (error) {
            toast.error("Something went wrong");
            console.log("Error in updateProduct function", error);
        } finally {
            set({ loading: false });
        }
    },

}))