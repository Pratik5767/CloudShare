import { useAuth } from "@clerk/clerk-react"
import DashbardLayout from "../layout/DashbardLayout"
import { useEffect } from "react";

const Dashboard = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        const displayToken = async () => {
            const token = await getToken();
            console.log(token);
        }
        displayToken();
    }, [])

    return (
        <DashbardLayout activeMenu="Dashboard">
            <div>
                Dashboard Content
            </div>
        </DashbardLayout>
    )
}

export default Dashboard