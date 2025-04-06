import React, { createContext, useState, useEffect } from "react";

export const UpdatesContext = createContext();

export const UpdatesProvider = ({ children }) => {
    const [updates, setUpdates] = useState(() => {
        // Load saved updates from localStorage when the app starts
        const savedUpdates = localStorage.getItem("updates");
        return savedUpdates ? JSON.parse(savedUpdates) : [];
    });

    const addUpdate = (newUpdate) => {
        const updatedList = [...updates, newUpdate];
        setUpdates(updatedList);
        localStorage.setItem("updates", JSON.stringify(updatedList)); // Save to localStorage
    };

    return (
        <UpdatesContext.Provider value={{ updates, addUpdate }}>
            {children}
        </UpdatesContext.Provider>
    );
};

