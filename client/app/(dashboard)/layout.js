import Sidebar from "@/components/layout/Sidebar";
import Background from "@/components/ui/Background";

export default function DashboardLayout({

    children,

}) {

    return (

        <Background>

            <Sidebar />

            {children}

        </Background>

    );

}