"use client";
import Feed from "@/components/feed";
import NavBar from "@/components/navBar";
import Hotline from "@/components/hotline";
import { useHotlineGUI } from "@/zustand/store";
import { Dialog } from "@/components/ui/dialog";

export default function Page() {
  
  const isVisible = useHotlineGUI(state => state.isVisible);
  const setVisible = useHotlineGUI(state => state.setVisible);

  return (
    <>
    <Dialog open={isVisible} onOpenChange={setVisible}>
      <Hotline />
    </Dialog>
    <div className="w-[100%] h-[80vh]">
      <div className="h-[100%]">
        <Feed />
        <div className="fixed bottom-0 w-full">
          <NavBar className="h-[10vh]" />
        </div>
      </div>
    </div>
    </>
  );
}
