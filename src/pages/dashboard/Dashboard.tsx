import { PageHeader } from "@/components/app/PageHeader/PageHeader";
import { Menu } from "@/constants/menu";

interface DashboardProps {
  menu: Menu;
}

const Dashboard = (props: DashboardProps) => {
  const { menu } = props;

  return (
    <>
      <PageHeader menu={menu} />
      <h1>Hello world</h1>
    </>
  );
};

export { Dashboard };
