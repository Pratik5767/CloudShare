import { useUser } from "@clerk/clerk-react"
import Navbar from "../components/Navbar";
import SideMenuBar from "../components/SideMenuBar";

const DashbardLayout = ({ children, activeMenu }) => {
    const { user } = useUser();

    return (
        <div className="bg-purple-100">
            {/* Navbar */}
            <Navbar activeMenu={activeMenu} />

            {
                user && (
                    <div className="flex">
                        <div className="max-[1080px]:hidden">
                            {/*Sidebar */}
                            <SideMenuBar activeMenu={activeMenu} />
                        </div>

                        <div className="grow mx-5">
                            {children}
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default DashbardLayout