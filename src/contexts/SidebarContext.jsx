import React, { createContext, useContext, useState } from 'react';
const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [visible, setVisible] = useState(false);

    function toggleSidebar() {
        setVisible((v) => !v);
    }

    return (
        <SidebarContext.Provider value={{ visible, setVisible, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
    return ctx;
}

export default SidebarContext;