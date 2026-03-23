import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

/** Number of distinct line items (products) in the cart, not total quantity. */
function lineItemCountInCart(cart) {
    if (!cart) return 0;
    const items = cart.items;
    if (Array.isArray(items)) {
        return items.length;
    }
    return Number(cart.items_count) || 0;
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshCart = useCallback(async () => {
        setLoading(true);
        try {
            const r = await fetch("/api/wc/cart", { credentials: "include" });
            const data = await r.json();
            if (!r.ok) {
                setCart(null);
                return;
            }
            setCart(data);
        } catch {
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, []);

    /** Apply cart JSON from Woo Store API (e.g. add-item response) without a round trip */
    const applyCartSnapshot = useCallback((data) => {
        if (
            data &&
            typeof data === "object" &&
            (Array.isArray(data.items) || data.items_count != null)
        ) {
            setCart(data);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const itemCount = useMemo(() => lineItemCountInCart(cart), [cart]);

    const value = {
        cart,
        loading,
        refreshCart,
        applyCartSnapshot,
        itemCount,
    };

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) {
        throw new Error("useCart must be used within CartProvider");
    }
    return ctx;
}
