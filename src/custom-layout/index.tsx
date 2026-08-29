"use client"
import { usePathname } from "next/navigation"
import PrivateLayout from "./private-layout";

 

const CustomLayout = ({children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const publicPaths = ["/","/login","/register","/reset-password","/forgot-password"].includes(pathname);

  if(publicPaths){
    return <div>{children}</div>
  }
  return (
     <>
      <div>
       <PrivateLayout>
      {children}
      </PrivateLayout> 
      </div>
     </>
  )
}

export default CustomLayout