"use client";

import { useAppSelector } from "@/store/hooks";

export default function ReduxExample() {
    const userData = useAppSelector(state => state.userReducer);
    return <div>
        <p className="text-lg">{JSON.stringify(userData)}</p>
    </div>
}