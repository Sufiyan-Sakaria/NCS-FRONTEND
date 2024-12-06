import { AppSidebar } from "@/components/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const DashboardLayout = () => {
  const token = useSelector((state: RootState) => state.token.value);
  const location = useLocation();

  if (!token) {
    return <Navigate to={"/auth/login"} />;
  }

  // Generate breadcrumbs based on the current path
  const pathSegments = location.pathname.split("/").filter(Boolean); // Split path and remove empty strings

  return (
    <main>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {pathSegments.map((segment, index) => {
                    const isLast = index === pathSegments.length - 1;
                    const url = `/${pathSegments
                      .slice(0, index + 1)
                      .join("/")}`;

                    return (
                      <>
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage className="capitalize">
                              {segment}
                            </BreadcrumbPage>
                          ) : (
                            <Link to={url} className="capitalize">
                              {segment}
                            </Link>
                          )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                      </>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
};

export default DashboardLayout;
