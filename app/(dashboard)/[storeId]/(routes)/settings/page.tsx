import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPagesProps {
    params: {
        storeId: string;
    }
}

const SettingsPage: React.FC<SettingsPagesProps> = async ({
    params
}) =>  {

    const { userId } = await auth()

    if(!userId) {
        redirect("/sign-in")
    }

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if (!store) {
        redirect("/")
    }

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
     );
}
 
export default SettingsPage;