/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Stats from "../features/correspondence/Stats";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { supabase } from "../services/supabase";
import AddCorresp from '../features/correspondence/AddCorresp';
export default function Correspondences() {
  const [userData, setUserData] = useState();
  const [isFormOpen, setIsFormOpen] = useState(false); // Manage form dialog state

  useEffect(() => {
    const getUserData = async () => {
      const { data } = await supabase.auth.getSession();
      setUserData(data?.session?.user);
    };
    getUserData();
  }, []);

  const openForm = () => {
    setIsFormOpen(true); // Open the form dialog
  };

  const closeForm = () => {
    setIsFormOpen(false); // Close the form dialog
  };

  return (
    <>
      {/* <div>
        <Stats />
      </div> */}

      <div className="flex justify-between">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-bgPrimary text-white font-medium"
          onClick={openForm}
        >
          <ShieldCheck className="h-4 w-4" />
          Add Policy
        </Button>
      </div>

      {/* Render the AddCorresp form dialog */}
      {isFormOpen && <AddCorresp isOpen={isFormOpen} onClose={closeForm} />}
    </>
  );
}
